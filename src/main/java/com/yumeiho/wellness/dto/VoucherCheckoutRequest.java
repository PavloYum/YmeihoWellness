package com.yumeiho.wellness.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class VoucherCheckoutRequest {
    @NotBlank @Size(max = 80) private String orderId;
    @NotBlank @Size(max = 40) private String telegramId;
    @NotBlank @Size(max = 200) private String purchaserName;
    @NotBlank @Size(max = 120) private String recipientName;
    @Size(max = 500) private String message;

    public String getOrderId() { return orderId; }
    public void setOrderId(String value) { orderId = value; }
    public String getTelegramId() { return telegramId; }
    public void setTelegramId(String value) { telegramId = value; }
    public String getPurchaserName() { return purchaserName; }
    public void setPurchaserName(String value) { purchaserName = value; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String value) { recipientName = value; }
    public String getMessage() { return message; }
    public void setMessage(String value) { message = value; }
}
