package com.smartstay.dto.pricing;

import lombok.Data;

@Data
public class PricingPreviewRequestDto {
    private Long roomTypeId;
    private String targetDate;
}
