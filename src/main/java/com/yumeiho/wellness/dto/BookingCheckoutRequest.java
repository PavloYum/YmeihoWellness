package com.yumeiho.wellness.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BookingCheckoutRequest {

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
    private String name;

    @NotBlank
    @Size(max = 50)
    private String phone;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
