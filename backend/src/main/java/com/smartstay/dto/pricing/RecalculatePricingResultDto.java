package com.smartstay.dto.pricing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecalculatePricingResultDto {
    private int totalRoomsEvaluated;
    private int pricesUpdated;
    private String recalculatedAt;
}
