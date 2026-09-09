package com.yumeiho.wellness.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yumeiho.wellness.dto.VoucherCheckoutRequest;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.time.OffsetDateTime;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
public class VoucherPurchaseService {
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final JdbcTemplate jdbc;
    private final RestClient http = RestClient.create();

    @Value("${voucher.hub-url}") private String hubUrl;
    @Value("${voucher.hub-token}") private String hubToken;
    @Value("${voucher.amount-cents:6000}") private long amountCents;
    @Value("${voucher.currency:EUR}") private String currency;
    @Value("${voucher.valid-days:90}") private int validDays;
    @Value("${telegram.bot-token}") private String telegramBotToken;

    public VoucherPurchaseService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @PostConstruct
    void initializeSchema() {
        jdbc.execute("""
            CREATE TABLE IF NOT EXISTS voucher_orders (
              order_id VARCHAR(80) PRIMARY KEY, telegram_id VARCHAR(40) NOT NULL,
              purchaser_name VARCHAR(200) NOT NULL, recipient_name VARCHAR(120) NOT NULL,
              gift_message VARCHAR(500), stripe_session_id VARCHAR(120) UNIQUE,
              status VARCHAR(30) NOT NULL, voucher_id VARCHAR(100), voucher_last4 VARCHAR(4),
              created_at VARCHAR(40) NOT NULL, paid_at VARCHAR(40), delivered_at VARCHAR(40)
            )
            """);
    }

    public long amountCents() { return amountCents; }
    public String currency() { return currency.toLowerCase(); }

    @Transactional
    public void attachSession(VoucherCheckoutRequest request, String sessionId) {
        jdbc.update("""
            MERGE INTO voucher_orders (order_id, telegram_id, purchaser_name, recipient_name,
              gift_message, stripe_session_id, status, created_at) KEY(order_id)
            VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)
            """, request.getOrderId(), request.getTelegramId(), request.getPurchaserName(),
            request.getRecipientName(), request.getMessage(), sessionId, OffsetDateTime.now().toString());
    }

    @Transactional
    public synchronized void fulfill(String sessionId) {
        var rows = jdbc.query("""
            SELECT order_id, telegram_id, purchaser_name, recipient_name, gift_message, status
            FROM voucher_orders WHERE stripe_session_id = ?
            """, (rs, n) -> new Order(rs.getString(1), rs.getString(2), rs.getString(3),
                rs.getString(4), rs.getString(5), rs.getString(6)), sessionId);
        if (rows.isEmpty() || "DELIVERED".equals(rows.get(0).status())) return;
        Order order = rows.get(0);
        String code = generateCode(order.orderId());
        OffsetDateTime expiresAt = OffsetDateTime.now().plusDays(validDays);

        VoucherResponse voucher = http.post().uri(hubUrl.replaceAll("/+$", "") + "/api/vouchers")
            .header("Authorization", "Bearer " + hubToken).contentType(MediaType.APPLICATION_JSON)
            .body(new VoucherRequest(code, "stripe:" + order.orderId(), amountCents / 100.0,
                currency.toUpperCase(), order.recipientName(), order.purchaserName(),
                order.message(), expiresAt.toString())).retrieve().body(VoucherResponse.class);
        if (voucher == null || voucher.id() == null) throw new IllegalStateException("VoucherHub returned no voucher");

        jdbc.update("UPDATE voucher_orders SET status='ISSUED', voucher_id=?, voucher_last4=?, paid_at=? WHERE order_id=?",
            voucher.id(), voucher.codeLast4(), OffsetDateTime.now().toString(), order.orderId());

        String text = "Ваш подарочный сертификат готов! 🎁\n\nПолучатель: " + order.recipientName()
            + "\nНоминал: " + (amountCents / 100) + " " + currency.toUpperCase()
            + "\nКод: " + code + "\nДействителен до: " + expiresAt.toLocalDate()
            + (order.message() == null || order.message().isBlank() ? "" : "\n\n" + order.message())
            + "\n\nСохраните код и предъявите его при записи на массаж.";
        http.post().uri("https://api.telegram.org/bot" + telegramBotToken + "/sendMessage")
            .contentType(MediaType.APPLICATION_JSON).body(new TelegramMessage(order.telegramId(), text))
            .retrieve().toBodilessEntity();
        jdbc.update("UPDATE voucher_orders SET status='DELIVERED', delivered_at=? WHERE order_id=?",
            OffsetDateTime.now().toString(), order.orderId());
    }

    private String generateCode(String orderId) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(hubToken.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal(("stripe:" + orderId).getBytes(StandardCharsets.UTF_8));
            StringBuilder body = new StringBuilder();
            for (int i = 0; i < 20; i++) body.append(ALPHABET.charAt(Byte.toUnsignedInt(digest[i]) % ALPHABET.length()));
            return "YUM-" + body.substring(0,5) + "-" + body.substring(5,10) + "-" + body.substring(10,15) + "-" + body.substring(15,20);
        } catch (GeneralSecurityException error) { throw new IllegalStateException(error); }
    }

    private record Order(String orderId, String telegramId, String purchaserName, String recipientName, String message, String status) {}
    private record VoucherRequest(String code, String orderId, double amount, String currency, String recipientName, String purchaserName, String message, String expiresAt) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    private record VoucherResponse(String id, String codeLast4) {}
    private record TelegramMessage(String chat_id, String text) {}
}
