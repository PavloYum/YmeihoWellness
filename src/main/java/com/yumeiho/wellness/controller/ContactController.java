package com.yumeiho.wellness.controller;

import com.yumeiho.wellness.dto.ContactRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.notification.email}")
    private String notificationEmail;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @PostMapping("/contact")
    public ResponseEntity<String> submitContactForm(@RequestBody ContactRequest request) {

        // Log the received data to console
        System.out.println("=================================================");
        System.out.println("Received New Contact Request:");
        System.out.println("Name:  " + request.getName());
        System.out.println("Phone: " + request.getPhone());
        System.out.println("=================================================");

        try {
            // Create and send the email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(notificationEmail);
            message.setSubject("Новая заявка с сайта YumeihoWellness!");
            message.setText("Поступила новая заявка на консультацию:\n\n" +
                    "👤 Имя клиента: " + request.getName() + "\n" +
                    "📞 Телефон: " + request.getPhone() + "\n\n" +
                    "---\nПисьмо сгенерировано автоматически с вашего сайта.");

            mailSender.send(message);
            System.out.println("Notification email sent successfully to " + notificationEmail);

            return ResponseEntity.ok("{\"status\":\"success\", \"message\":\"Contact request received! Email sent.\"}");
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();
            // Возвращаем ошибку клиента, чтобы JavaScript мог показать красную кнопку,
            // так как вы хотите быть уверены, что заявка ушла.
            return ResponseEntity.internalServerError()
                    .body("{\"status\":\"error\", \"message\":\"Failed to send notification email\"}");
        }
    }
}
