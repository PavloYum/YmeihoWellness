package com.yumeiho.wellness.controller;

import com.yumeiho.wellness.dto.ContactRequest;
import com.yumeiho.wellness.service.NotificationService;
import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final NotificationService notificationService;

    public ContactController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> submitContactForm(@Valid @RequestBody ContactRequest request) {
        log.info("Received new contact request from name='{}' phone='{}'", request.getName(), request.getPhone());

        try {
            notificationService.sendContactRequest(request.getName(), request.getPhone());

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
