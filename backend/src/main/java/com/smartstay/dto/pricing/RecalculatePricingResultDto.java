package com.smartstay.dto.pricing;

public class RecalculatePricingResultDto {
    private int totalRoomsEvaluated;
    private int pricesUpdated;
    private String recalculatedAt;

    public RecalculatePricingResultDto() {
    }

    public RecalculatePricingResultDto(int totalRoomsEvaluated, int pricesUpdated, String recalculatedAt) {
        this.totalRoomsEvaluated = totalRoomsEvaluated;
        this.pricesUpdated = pricesUpdated;
        this.recalculatedAt = recalculatedAt;
    }

    public int getTotalRoomsEvaluated() { return totalRoomsEvaluated; }
    public void setTotalRoomsEvaluated(int totalRoomsEvaluated) { this.totalRoomsEvaluated = totalRoomsEvaluated; }

    public int getPricesUpdated() { return pricesUpdated; }
    public void setPricesUpdated(int pricesUpdated) { this.pricesUpdated = pricesUpdated; }

    public String getRecalculatedAt() { return recalculatedAt; }
    public void setRecalculatedAt(String recalculatedAt) { this.recalculatedAt = recalculatedAt; }

    public static RecalculatePricingResultDtoBuilder builder() {
        return new RecalculatePricingResultDtoBuilder();
    }

    public static class RecalculatePricingResultDtoBuilder {
        private int totalRoomsEvaluated;
        private int pricesUpdated;
        private String recalculatedAt;

        public RecalculatePricingResultDtoBuilder totalRoomsEvaluated(int totalRoomsEvaluated) { this.totalRoomsEvaluated = totalRoomsEvaluated; return this; }
        public RecalculatePricingResultDtoBuilder pricesUpdated(int pricesUpdated) { this.pricesUpdated = pricesUpdated; return this; }
        public RecalculatePricingResultDtoBuilder recalculatedAt(String recalculatedAt) { this.recalculatedAt = recalculatedAt; return this; }

        public RecalculatePricingResultDto build() {
            return new RecalculatePricingResultDto(totalRoomsEvaluated, pricesUpdated, recalculatedAt);
        }
    }
}
