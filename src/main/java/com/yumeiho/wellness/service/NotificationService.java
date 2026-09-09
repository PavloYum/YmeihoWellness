package com.yumeiho.wellness.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${app.notification.email}")
    private String notificationEmail;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactRequest(String name, String phone) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(notificationEmail);
        message.setSubject("Новая заявка с сайта YumeihoWellness!");
        message.setText("Поступила новая заявка на консультацию:\n\n" +
                "Имя клиента: " + name + "\n" +
                "Телефон: " + phone + "\n\n" +
                "---\nПисьмо сгенерировано автоматически с вашего сайта.");

        mailSender.send(message);
        log.info("Notification email sent successfully to {}", notificationEmail);
    }

    public void sendPaidBooking(String name, String phone, String serviceName, String appointmentStart, String sessionId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(notificationEmail);
        message.setSubject("Оплаченная бронь YumeihoWellness");
        message.setText("Клиент оплатил бронирование через Stripe:\n\n" +
                "Имя клиента: " + name + "\n" +
                "Телефон: " + phone + "\n" +
                "Услуга: " + serviceName + "\n" +
                "Время: " + appointmentStart + "\n" +
                "Stripe Checkout Session: " + sessionId + "\n\n" +
                "---\nПроверьте платеж в Stripe Dashboard.");

        mailSender.send(message);
        log.info("Paid booking notification sent for Stripe session {}", sessionId);
    }
}
