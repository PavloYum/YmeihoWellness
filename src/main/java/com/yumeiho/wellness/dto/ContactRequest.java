package com.yumeiho.wellness.dto;

public class ContactRequest {

    private String name;
    private String phone;

    // Constructors
    public ContactRequest() {
    }

    public ContactRequest(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "ContactRequest{" +
                "name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}
