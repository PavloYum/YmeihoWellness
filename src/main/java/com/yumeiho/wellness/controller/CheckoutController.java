package com.yumeiho.wellness.controller;

import com.stripe.StripeClient;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.yumeiho.wellness.dto.AdminBlocksRequest;
import com.yumeiho.wellness.dto.AdminBlocksResponse;
import com.yumeiho.wellness.dto.AvailabilityResponse;
import com.yumeiho.wellness.dto.BotBookingRequest;
import com.yumeiho.wellness.dto.BookingCheckoutRequest;
import com.yumeiho.wellness.dto.VoucherCheckoutRequest;
import com.yumeiho.wellness.service.BookingService;
import com.yumeiho.wellness.service.NotificationService;
import com.yumeiho.wellness.service.VoucherPurchaseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api")
public class CheckoutController {

    private static final Logger log = LoggerFactory.getLogger(CheckoutController.class);

    private final BookingService bookingService;
    private final NotificationService notificationService;
    private final VoucherPurchaseService voucherPurchaseService;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret}")
    private String stripeWebhookSecret;

    @Value("${app.public-url}")
    private String appPublicUrl;

    @Value("${app.admin-token}")
    private String adminToken;

    @Value("${app.bot-token}")
    private String botToken;

    public CheckoutController(BookingService bookingService, NotificationService notificationService,
                              VoucherPurchaseService voucherPurchaseService) {
        this.bookingService = bookingService;
        this.notificationService = notificationService;
        this.voucherPurchaseService = voucherPurchaseService;
    }

    @GetMapping("/availability")
    public ResponseEntity<AvailabilityResponse> getAvailability(@RequestParam String date) {
        if (date == null || !date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest().body(new AvailabilityResponse(List.of()));
        }

        return ResponseEntity.ok(new AvailabilityResponse(bookingService.findUnavailableTimes(date)));
    }

    @GetMapping("/admin/blocks")
    public ResponseEntity<AdminBlocksResponse> getManualBlocks(
            @RequestParam String date,
            @RequestHeader(value = "X-Admin-Token", required = false) String token
    ) {
        if (!isAdminAllowed(token)) {
            return ResponseEntity.status(403).body(new AdminBlocksResponse(List.of()));
        }
        if (date == null || !date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest().body(new AdminBlocksResponse(List.of()));
        }

        return ResponseEntity.ok(new AdminBlocksResponse(bookingService.findManualBlockedTimes(date)));
    }

    @GetMapping("/admin/bookings")
    public ResponseEntity<List<BookingService.BookingListItem>> getBookings(
            @RequestHeader(value = "X-Admin-Token", required = false) String token
    ) {
        if (!isAdminAllowed(token)) {
            return ResponseEntity.status(403).body(List.of());
        }

        return ResponseEntity.ok(bookingService.findUpcomingBookings(OffsetDateTime.now().minusHours(1)));
    }

    @PostMapping("/bot/bookings")
    public ResponseEntity<Map<String, String>> createBotBooking(
            @Valid @RequestBody BotBookingRequest request,
            @RequestHeader(value = "X-Bot-Token", required = false) String token
    ) {
        if (!isBotAllowed(token)) {
            return ResponseEntity.status(403).body(Map.of(
                    "status", "error",
                    "message", "Forbidden"
            ));
        }

        OffsetDateTime appointmentStart = OffsetDateTime.parse(request.getAppointmentStart());
        if (appointmentStart.isBefore(OffsetDateTime.now().plusHours(1)) ||
                appointmentStart.isAfter(OffsetDateTime.now().plusMonths(1)) ||
                isBlockedDate(appointmentStart.toLocalDate())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Appointment time is not available"
            ));
        }

        try {
            BookingService.BookingDetails booking = bookingService.createExternalBooking(
                    "telegram_bot",
                    request.getServiceId(),
                    request.getServiceName(),
                    appointmentStart,
                    request.getClientName(),
                    request.getClientPhone() == null ? "" : request.getClientPhone(),
                    request.getTelegramId(),
                    request.getUsername(),
                    request.getExternalReference()
            );
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "bookingId", booking.id()
            ));
        } catch (BookingService.SlotUnavailableException e) {
            return ResponseEntity.status(409).body(Map.of(
                    "status", "error",
                    "message", "Appointment time is already booked"
            ));
        }
    }

    @GetMapping("/bot/bookings")
    public ResponseEntity<List<BookingService.BookingListItem>> getBotBookings(
            @RequestParam String telegramId,
            @RequestHeader(value = "X-Bot-Token", required = false) String token
    ) {
        if (!isBotAllowed(token)) {
            return ResponseEntity.status(403).body(List.of());
        }
        if (!hasText(telegramId)) {
            return ResponseEntity.badRequest().body(List.of());
        }

        return ResponseEntity.ok(bookingService.findUpcomingBookingsForTelegram(
                telegramId,
                OffsetDateTime.now().minusHours(1)
        ));
    }

    @GetMapping("/bot/blocks")
    public ResponseEntity<AdminBlocksResponse> getBotBlocks(
            @RequestParam String date,
            @RequestHeader(value = "X-Bot-Token", required = false) String token
    ) {
        if (!isBotAllowed(token)) {
            return ResponseEntity.status(403).body(new AdminBlocksResponse(List.of()));
        }
        if (date == null || !date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest().body(new AdminBlocksResponse(List.of()));
        }

        return ResponseEntity.ok(new AdminBlocksResponse(bookingService.findManualBlockedTimes(date)));
    }

    @PostMapping("/bot/blocks")
    public ResponseEntity<Map<String, String>> saveBotBlocks(
            @Valid @RequestBody AdminBlocksRequest request,
            @RequestHeader(value = "X-Bot-Token", required = false) String token
    ) {
        if (!isBotAllowed(token)) {
            return ResponseEntity.status(403).body(Map.of(
                    "status", "error",
                    "message", "Forbidden"
            ));
        }
        if (!request.getDate().matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Invalid date"
            ));
        }

        List<String> blockedTimes = request.getBlockedTimes() == null ? List.of() : request.getBlockedTimes();
        boolean hasInvalidTime = blockedTimes.stream().anyMatch((appointmentStart) ->
                appointmentStart == null || !appointmentStart.startsWith(request.getDate() + "T"));
        if (hasInvalidTime) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Invalid blocked time"
            ));
        }

        bookingService.replaceManualBlocks(request.getDate(), blockedTimes);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @PostMapping("/bot/bookings/{bookingId}/cancel")
    public ResponseEntity<Map<String, String>> cancelBotBooking(
            @PathVariable String bookingId,
            @RequestHeader(value = "X-Bot-Token", required = false) String token
    ) {
        if (!isBotAllowed(token)) {
            return ResponseEntity.status(403).body(Map.of(
                    "status", "error",
                    "message", "Forbidden"
            ));
        }

        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @PostMapping("/admin/blocks")
    public ResponseEntity<Map<String, String>> saveManualBlocks(
            @Valid @RequestBody AdminBlocksRequest request,
            @RequestHeader(value = "X-Admin-Token", required = false) String token
    ) {
        if (!isAdminAllowed(token)) {
            return ResponseEntity.status(403).body(Map.of(
                    "status", "error",
                    "message", "Forbidden"
            ));
        }
        if (!request.getDate().matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Invalid date"
            ));
        }

        List<String> blockedTimes = request.getBlockedTimes() == null ? List.of() : request.getBlockedTimes();
        boolean hasInvalidTime = blockedTimes.stream().anyMatch((appointmentStart) ->
                appointmentStart == null || !appointmentStart.startsWith(request.getDate() + "T"));
        if (hasInvalidTime) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Invalid blocked time"
            ));
        }

        bookingService.replaceManualBlocks(request.getDate(), blockedTimes);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> createCheckoutSession(
            @Valid @RequestBody BookingCheckoutRequest request,
            HttpServletRequest servletRequest
    ) throws Exception {
        if (!hasText(stripeSecretKey)) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", "Stripe is not configured"
            ));
        }

        ServiceOffer offer = ServiceOffer.fromId(request.getServiceId());
        if (offer == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Unknown service"
            ));
        }

        OffsetDateTime appointmentStart = OffsetDateTime.parse(request.getAppointmentStart());
        if (appointmentStart.isBefore(OffsetDateTime.now().plusHours(1))) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Appointment time is not available"
            ));
        }
        if (appointmentStart.isAfter(OffsetDateTime.now().plusMonths(1))) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Appointment time must be within one month"
            ));
        }
        if (isBlockedDate(appointmentStart.toLocalDate())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Appointment date is blocked"
            ));
        }

        BookingService.BookingReservation reservation;
        try {
            reservation = bookingService.reserveSlot(
                    offer.id(),
                    offer.name(),
                    appointmentStart,
                    request.getName(),
                    request.getPhone()
            );
        } catch (BookingService.SlotUnavailableException e) {
            return ResponseEntity.status(409).body(Map.of(
                    "status", "error",
                    "message", "Appointment time is already booked"
            ));
        }

        StripeClient stripeClient = new StripeClient(stripeSecretKey);

        String baseUrl = getBaseUrl(servletRequest);
        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(offer.name())
                        .build();

        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("eur")
                        .setUnitAmount(offer.amountCents())
                        .setProductData(productData)
                        .build();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(baseUrl + "/booking.html?payment=success&session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(baseUrl + "/booking.html?payment=cancelled&service=" + offer.id())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(priceData)
                        .build())
                .putMetadata("serviceId", offer.id())
                .putMetadata("bookingId", reservation.bookingId())
                .putMetadata("serviceName", offer.name())
                .putMetadata("appointmentStart", appointmentStart.toString())
                .putMetadata("clientName", request.getName())
                .putMetadata("clientPhone", request.getPhone())
                .putExtraParam("integration_identifier", integrationIdentifier("booking:" + reservation.bookingId()))
                .build();

        Session session;
        try {
            session = stripeClient.v1().checkout().sessions().create(params, RequestOptions.builder()
                    .setIdempotencyKey("booking-checkout-" + reservation.bookingId())
                    .build());
        } catch (Exception e) {
            bookingService.releaseReservation(reservation.bookingId());
            throw e;
        }
        bookingService.attachStripeSession(reservation.bookingId(), session.getId());
        log.info("Created Stripe Checkout Session {} for service {} at {}", session.getId(), offer.id(), appointmentStart);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "checkoutUrl", session.getUrl()
        ));
    }

    @PostMapping("/bot/vouchers/checkout")
    public ResponseEntity<Map<String, String>> createVoucherCheckout(
            @Valid @RequestBody VoucherCheckoutRequest request,
            @RequestHeader(value = "X-Bot-Token", required = false) String token,
            HttpServletRequest servletRequest
    ) throws Exception {
        if (!isBotAllowed(token)) return ResponseEntity.status(403).body(Map.of("status", "error", "message", "Forbidden"));
        if (!hasText(stripeSecretKey)) return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Stripe is not configured"));

        StripeClient stripeClient = new StripeClient(stripeSecretKey);
        String baseUrl = getBaseUrl(servletRequest);
        var product = SessionCreateParams.LineItem.PriceData.ProductData.builder()
                .setName("Подарочный сертификат YumeihoWellness")
                .setDescription("Сертификат на массаж для " + request.getRecipientName())
                .build();
        var price = SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency(voucherPurchaseService.currency())
                .setUnitAmount(voucherPurchaseService.amountCents())
                .setProductData(product)
                .build();
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setClientReferenceId("voucher:" + request.getOrderId())
                .setSuccessUrl(baseUrl + "/booking.html?payment=voucher-success")
                .setCancelUrl(baseUrl + "/booking.html?payment=cancelled")
                .addLineItem(SessionCreateParams.LineItem.builder().setQuantity(1L).setPriceData(price).build())
                .putMetadata("purchaseType", "voucher")
                .putMetadata("voucherOrderId", request.getOrderId())
                .putExtraParam("integration_identifier", integrationIdentifier("voucher:" + request.getOrderId()))
                .build();
        Session session = stripeClient.v1().checkout().sessions().create(params, RequestOptions.builder()
                .setIdempotencyKey("voucher-checkout-" + request.getOrderId())
                .build());
        voucherPurchaseService.attachSession(request, session.getId());
        return ResponseEntity.ok(Map.of("status", "success", "checkoutUrl", session.getUrl()));
    }

    @PostMapping("/stripe/webhook")
    public ResponseEntity<Map<String, String>> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature
    ) throws SignatureVerificationException {
        if (!hasText(stripeWebhookSecret)) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", "Stripe webhook is not configured"
            ));
        }

        Event event = Webhook.constructEvent(payload, signature, stripeWebhookSecret);
        if ("checkout.session.completed".equals(event.getType())) {
            StripeObject object = event.getDataObjectDeserializer().getObject().orElse(null);
            if (object instanceof Session session) {
                if ("voucher".equals(session.getMetadata().get("purchaseType"))) {
                    voucherPurchaseService.fulfill(session.getId());
                    return ResponseEntity.ok(Map.of("status", "received"));
                }
                bookingService.markPaidByStripeSession(session.getId()).ifPresentOrElse((booking) ->
                                notificationService.sendPaidBooking(
                                        booking.clientName(),
                                        booking.clientPhone(),
                                        booking.serviceName(),
                                        booking.appointmentStart(),
                                        session.getId()
                                ),
                        () -> {
                            Map<String, String> metadata = session.getMetadata();
                            notificationService.sendPaidBooking(
                                    metadata.getOrDefault("clientName", "Unknown"),
                                    metadata.getOrDefault("clientPhone", "Unknown"),
                                    metadata.getOrDefault("serviceName", "Unknown"),
                                    metadata.getOrDefault("appointmentStart", "Unknown"),
                                    session.getId()
                            );
                        });
            }
        }

        return ResponseEntity.ok(Map.of("status", "received"));
    }

    private String getBaseUrl(HttpServletRequest request) {
        if (hasText(appPublicUrl)) {
            return appPublicUrl.replaceAll("/+$", "");
        }

        URI uri = ServletUriComponentsBuilder.fromRequestUri(request)
                .replacePath(null)
                .replaceQuery(null)
                .build()
                .toUri();
        return uri.toString();
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private boolean isAdminAllowed(String token) {
        return hasText(adminToken) && adminToken.equals(token);
    }

    private boolean isBotAllowed(String token) {
        return hasText(botToken) && botToken.equals(token);
    }

    private boolean isBlockedDate(LocalDate date) {
        return isBetween(date, LocalDate.of(2026, 8, 23), LocalDate.of(2026, 9, 3)) ||
                isBetween(date, LocalDate.of(2026, 10, 15), LocalDate.of(2026, 10, 28));
    }

    private String integrationIdentifier(String seed) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(seed.getBytes(StandardCharsets.UTF_8));
            StringBuilder suffix = new StringBuilder(8);
            for (int i = 0; i < 8; i++) {
                suffix.append((char) ('a' + Byte.toUnsignedInt(digest[i]) % 26));
            }
            return "yumeiho_checkout_" + suffix;
        } catch (Exception e) {
            throw new IllegalStateException("Cannot create Stripe integration identifier", e);
        }
    }

    private boolean isBetween(LocalDate date, LocalDate start, LocalDate end) {
        return !date.isBefore(start) && !date.isAfter(end);
    }

    private record ServiceOffer(String id, String name, long amountCents) {
        private static ServiceOffer fromId(String id) {
            return switch (id) {
                case "consultation" -> new ServiceOffer(id, "Первичная консультация специалиста", 3000);
                case "trial" -> new ServiceOffer(id, "Первичная консультация + пробное занятие", 4900);
                case "yumeiho-basic" -> new ServiceOffer(id, "Сеанс Юмейхо (базовый)", 8000);
                case "biomechanics" -> new ServiceOffer(id, "Функциональная биомеханика тела", 6000);
                case "complex" -> new ServiceOffer(id, "Комплексный сеанс", 12000);
                case "course" -> new ServiceOffer(id, "Курс лечения (10 сеансов Юмейхо)", 70000);
                default -> null;
            };
        }
    }
}
