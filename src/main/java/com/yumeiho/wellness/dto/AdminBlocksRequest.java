package com.yumeiho.wellness.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AdminBlocksRequest {

    @NotBlank
    private String date;

    private List<String> blockedTimes;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<String> getBlockedTimes() {
        return blockedTimes;
    }

    public void setBlockedTimes(List<String> blockedTimes) {
        this.blockedTimes = blockedTimes;
    }
}
