package com.yumeiho.wellness.controller;

import com.yumeiho.wellness.dto.ContactRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final JavaMailSender mailSender;

    @Value("${app.notification.email}")
    private String notificationEmail;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public ContactController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> submitContactForm(@Valid @RequestBody ContactRequest request) {
        log.info("Received new contact request from name='{}' phone='{}'", request.getName(), request.getPhone());

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(notificationEmail);
            message.setSubject("Новая заявка с сайта YumeihoWellness!");
            message.setText("Поступила новая заявка на консультацию:\n\n" +
                    "👤 Имя клиента: " + request.getName() + "\n" +
                    "📞 Телефон: " + request.getPhone() + "\n\n" +
                    "---\nПисьмо сгенерировано автоматически с вашего сайта.");

            mailSender.send(message);
            log.info("Notification email sent successfully to {}", notificationEmail);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Contact request received"
            ));
        } catch (Exception e) {
            log.error("Error sending notification email", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to send notification email"
                    ));
        }
    }
}
