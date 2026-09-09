package com.yumeiho.wellness.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BotBookingRequest {

    @NotBlank
    @Size(max = 60)
    private String serviceId;

    @NotBlank
    @Size(max = 120)
    private String serviceName;

    @NotBlank
    @Size(max = 40)
    private String appointmentStart;

    @NotBlank
    @Size(max = 100)
    private String clientName;

    @Size(max = 50)
    private String clientPhone;

    @Size(max = 40)
    private String telegramId;

    @Size(max = 120)
    private String username;

    @Size(max = 160)
    private String externalReference;

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getAppointmentStart() {
        return appointmentStart;
    }

    public void setAppointmentStart(String appointmentStart) {
        this.appointmentStart = appointmentStart;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientPhone() {
        return clientPhone;
    }

    public void setClientPhone(String clientPhone) {
        this.clientPhone = clientPhone;
    }

    public String getTelegramId() {
        return telegramId;
    }

    public void setTelegramId(String telegramId) {
        this.telegramId = telegramId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getExternalReference() {
        return externalReference;
    }

    public void setExternalReference(String externalReference) {
        this.externalReference = externalReference;
    }
}
