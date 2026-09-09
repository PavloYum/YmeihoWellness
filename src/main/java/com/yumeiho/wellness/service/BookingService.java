package com.yumeiho.wellness.service;

import jakarta.annotation.PostConstruct;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private static final int PENDING_MINUTES = 15;

    private final JdbcTemplate jdbcTemplate;

    public BookingService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void initializeSchema() {
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS bookings (
                    id VARCHAR(36) PRIMARY KEY,
                    service_id VARCHAR(60) NOT NULL,
                    service_name VARCHAR(120) NOT NULL,
                    appointment_start VARCHAR(40) NOT NULL,
                    client_name VARCHAR(100) NOT NULL,
                    client_phone VARCHAR(50) NOT NULL,
                    status VARCHAR(20) NOT NULL,
                    stripe_session_id VARCHAR(120),
                    created_at VARCHAR(40) NOT NULL,
                    expires_at VARCHAR(40) NOT NULL,
                    paid_at VARCHAR(40)
                )
                """);
        addColumnIfMissing("bookings", "source", "VARCHAR(40) DEFAULT 'website' NOT NULL");
        addColumnIfMissing("bookings", "payment_status", "VARCHAR(30) DEFAULT 'pending' NOT NULL");
        addColumnIfMissing("bookings", "client_telegram_id", "VARCHAR(40)");
        addColumnIfMissing("bookings", "client_username", "VARCHAR(120)");
        addColumnIfMissing("bookings", "external_reference", "VARCHAR(160)");
        addColumnIfMissing("bookings", "cancelled_at", "VARCHAR(40)");
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS manual_blocks (
                    appointment_start VARCHAR(40) PRIMARY KEY,
                    created_at VARCHAR(40) NOT NULL
                )
                """);
    }

    private void addColumnIfMissing(String tableName, String columnName, String definition) {
        try {
            jdbcTemplate.execute("ALTER TABLE " + tableName + " ADD COLUMN IF NOT EXISTS " + columnName + " " + definition);
        } catch (RuntimeException ignored) {
            // Older H2 versions may not support IF NOT EXISTS for ALTER TABLE.
        }
    }

    @Transactional
    public synchronized BookingReservation reserveSlot(
            String serviceId,
            String serviceName,
            OffsetDateTime appointmentStart,
            String clientName,
            String clientPhone
    ) {
        cleanupExpiredPending();
        String normalizedAppointmentStart = normalize(appointmentStart);
        if (isSlotUnavailable(normalizedAppointmentStart)) {
            throw new SlotUnavailableException();
        }

        String bookingId = UUID.randomUUID().toString();
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime expiresAt = now.plusMinutes(PENDING_MINUTES);

        jdbcTemplate.update((connection) -> {
            PreparedStatement statement = connection.prepareStatement("""
                    INSERT INTO bookings (
                        id, service_id, service_name, appointment_start, client_name, client_phone,
                        status, payment_status, source, created_at, expires_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, 'PENDING', 'pending', 'website', ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, bookingId);
            statement.setString(2, serviceId);
            statement.setString(3, serviceName);
            statement.setString(4, normalizedAppointmentStart);
            statement.setString(5, clientName);
            statement.setString(6, clientPhone);
            statement.setString(7, now.toString());
            statement.setString(8, expiresAt.toString());
            return statement;
        });

        return new BookingReservation(bookingId, expiresAt);
    }

    public void attachStripeSession(String bookingId, String stripeSessionId) {
        jdbcTemplate.update("""
                UPDATE bookings
                SET stripe_session_id = ?
                WHERE id = ?
                """, stripeSessionId, bookingId);
    }

    public void releaseReservation(String bookingId) {
        jdbcTemplate.update("""
                UPDATE bookings
                SET status = 'FAILED', payment_status = 'failed'
                WHERE id = ?
                  AND status = 'PENDING'
                """, bookingId);
    }

    @Transactional
    public Optional<BookingDetails> markPaidByStripeSession(String stripeSessionId) {
        List<BookingDetails> bookings = jdbcTemplate.query("""
                SELECT id, service_name, appointment_start, client_name, client_phone
                FROM bookings
                WHERE stripe_session_id = ?
                """, (rs, rowNum) -> new BookingDetails(
                rs.getString("id"),
                rs.getString("service_name"),
                rs.getString("appointment_start"),
                rs.getString("client_name"),
                rs.getString("client_phone")
        ), stripeSessionId);

        if (bookings.isEmpty()) {
            return Optional.empty();
        }

        jdbcTemplate.update("""
                UPDATE bookings
                SET status = 'PAID', payment_status = 'paid', paid_at = ?
                WHERE stripe_session_id = ?
                """, OffsetDateTime.now().toString(), stripeSessionId);

        return Optional.of(bookings.get(0));
    }

    public List<String> findUnavailableTimes(String datePrefix) {
        cleanupExpiredPending();
        List<String> bookingTimes = jdbcTemplate.queryForList("""
                        SELECT appointment_start
                        FROM bookings
                        WHERE appointment_start LIKE ?
                          AND status IN ('PENDING', 'PAID', 'CONFIRMED')
                        """,
                String.class,
                datePrefix + "%"
        );
        List<String> manualTimes = findManualBlockedTimes(datePrefix);

        bookingTimes.addAll(manualTimes);
        return bookingTimes.stream().distinct().sorted().toList();
    }

    public List<String> findManualBlockedTimes(String datePrefix) {
        return jdbcTemplate.queryForList("""
                        SELECT appointment_start
                        FROM manual_blocks
                        WHERE appointment_start LIKE ?
                        ORDER BY appointment_start
                        """,
                String.class,
                datePrefix + "%"
        );
    }

    @Transactional
    public void replaceManualBlocks(String datePrefix, List<String> appointmentStarts) {
        jdbcTemplate.update("""
                DELETE FROM manual_blocks
                WHERE appointment_start LIKE ?
                """, datePrefix + "%");

        OffsetDateTime now = OffsetDateTime.now();
        appointmentStarts.stream()
                .distinct()
                .sorted()
                .forEach((appointmentStart) -> jdbcTemplate.update("""
                        INSERT INTO manual_blocks (appointment_start, created_at)
                        VALUES (?, ?)
                        """, appointmentStart, now.toString()));
    }

    public boolean isSlotUnavailable(OffsetDateTime appointmentStart) {
        return isSlotUnavailable(normalize(appointmentStart));
    }

    private boolean isSlotUnavailable(String appointmentStart) {
        cleanupExpiredPending();
        Integer bookingCount = jdbcTemplate.queryForObject("""
                        SELECT COUNT(*)
                        FROM bookings
                        WHERE appointment_start = ?
                          AND status IN ('PENDING', 'PAID', 'CONFIRMED')
                """,
                Integer.class,
                appointmentStart
        );
        Integer blockCount = jdbcTemplate.queryForObject("""
                        SELECT COUNT(*)
                        FROM manual_blocks
                        WHERE appointment_start = ?
                """,
                Integer.class,
                appointmentStart
        );
        return (bookingCount != null && bookingCount > 0) || (blockCount != null && blockCount > 0);
    }

    public void cleanupExpiredPending() {
        jdbcTemplate.update("""
                UPDATE bookings
                SET status = 'EXPIRED', payment_status = 'expired'
                WHERE status = 'PENDING'
                  AND expires_at < ?
                """, OffsetDateTime.now().toString());
    }

    @Transactional
    public synchronized BookingDetails createExternalBooking(
            String source,
            String serviceId,
            String serviceName,
            OffsetDateTime appointmentStart,
            String clientName,
            String clientPhone,
            String clientTelegramId,
            String clientUsername,
            String externalReference
    ) {
        cleanupExpiredPending();
        String normalizedAppointmentStart = normalize(appointmentStart);
        if (isSlotUnavailable(normalizedAppointmentStart)) {
            throw new SlotUnavailableException();
        }

        String bookingId = UUID.randomUUID().toString();
        OffsetDateTime now = OffsetDateTime.now();
        jdbcTemplate.update("""
                INSERT INTO bookings (
                    id, service_id, service_name, appointment_start, client_name, client_phone,
                    status, payment_status, source, created_at, expires_at,
                    client_telegram_id, client_username, external_reference
                )
                VALUES (?, ?, ?, ?, ?, ?, 'CONFIRMED', 'not_required', ?, ?, ?, ?, ?, ?)
                """,
                bookingId,
                serviceId,
                serviceName,
                normalizedAppointmentStart,
                clientName,
                clientPhone,
                source,
                now.toString(),
                now.toString(),
                clientTelegramId,
                clientUsername,
                externalReference
        );

        return new BookingDetails(bookingId, serviceName, normalizedAppointmentStart, clientName, clientPhone);
    }

    @Transactional
    public void cancelBooking(String bookingId) {
        jdbcTemplate.update("""
                UPDATE bookings
                SET status = 'CANCELLED', cancelled_at = ?
                WHERE id = ?
                  AND status IN ('PENDING', 'PAID', 'CONFIRMED')
                """, OffsetDateTime.now().toString(), bookingId);
    }

    public List<BookingListItem> findUpcomingBookings(OffsetDateTime from) {
        cleanupExpiredPending();
        return jdbcTemplate.query("""
                        SELECT id, service_id, service_name, appointment_start, client_name, client_phone,
                               status, payment_status, source, client_telegram_id, client_username, stripe_session_id,
                               created_at, paid_at
                        FROM bookings
                        WHERE appointment_start >= ?
                          AND status IN ('PENDING', 'PAID', 'CONFIRMED')
                        ORDER BY appointment_start
                        """,
                (rs, rowNum) -> new BookingListItem(
                        rs.getString("id"),
                        rs.getString("service_id"),
                        rs.getString("service_name"),
                        rs.getString("appointment_start"),
                        rs.getString("client_name"),
                        rs.getString("client_phone"),
                        rs.getString("status"),
                        rs.getString("payment_status"),
                        rs.getString("source"),
                        rs.getString("client_telegram_id"),
                        rs.getString("client_username"),
                        rs.getString("stripe_session_id"),
                        rs.getString("created_at"),
                        rs.getString("paid_at")
                ),
                from.toString()
        );
    }

    public List<BookingListItem> findUpcomingBookingsForTelegram(String telegramId, OffsetDateTime from) {
        cleanupExpiredPending();
        return jdbcTemplate.query("""
                        SELECT id, service_id, service_name, appointment_start, client_name, client_phone,
                               status, payment_status, source, client_telegram_id, client_username, stripe_session_id,
                               created_at, paid_at
                        FROM bookings
                        WHERE appointment_start >= ?
                          AND client_telegram_id = ?
                          AND status IN ('PENDING', 'PAID', 'CONFIRMED')
                        ORDER BY appointment_start
                        """,
                (rs, rowNum) -> new BookingListItem(
                        rs.getString("id"),
                        rs.getString("service_id"),
                        rs.getString("service_name"),
                        rs.getString("appointment_start"),
                        rs.getString("client_name"),
                        rs.getString("client_phone"),
                        rs.getString("status"),
                        rs.getString("payment_status"),
                        rs.getString("source"),
                        rs.getString("client_telegram_id"),
                        rs.getString("client_username"),
                        rs.getString("stripe_session_id"),
                        rs.getString("created_at"),
                        rs.getString("paid_at")
                ),
                from.toString(),
                telegramId
        );
    }

    public record BookingReservation(String bookingId, OffsetDateTime expiresAt) {
    }

    private String normalize(OffsetDateTime appointmentStart) {
        return appointmentStart.toInstant().toString();
    }

    public record BookingDetails(
            String id,
            String serviceName,
            String appointmentStart,
            String clientName,
            String clientPhone
    ) {
    }

    public record BookingListItem(
            String id,
            String serviceId,
            String serviceName,
            String appointmentStart,
            String clientName,
            String clientPhone,
            String status,
            String paymentStatus,
            String source,
            String clientTelegramId,
            String clientUsername,
            String stripeSessionId,
            String createdAt,
            String paidAt
    ) {
    }

    public static class SlotUnavailableException extends RuntimeException {
    }
}
