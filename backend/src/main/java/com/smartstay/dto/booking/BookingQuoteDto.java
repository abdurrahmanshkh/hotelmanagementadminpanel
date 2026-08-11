package com.smartstay.dto.booking;

import java.math.BigDecimal;

public class BookingQuoteDto {

    private String quoteId;
    private Long roomId;
    private int numberOfNights;
    private BigDecimal basePricePerNight;
    private BigDecimal appliedPricePerNight;
    private BigDecimal roomAmount;
    private double taxPercentage;
    private BigDecimal taxAmount;
    private double serviceFeePercentage;
    private BigDecimal serviceFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String currency;
    private String validUntil;

    public BookingQuoteDto() {
    }

    public BookingQuoteDto(String quoteId, Long roomId, int numberOfNights, BigDecimal basePricePerNight, BigDecimal appliedPricePerNight, BigDecimal roomAmount, double taxPercentage, BigDecimal taxAmount, double serviceFeePercentage, BigDecimal serviceFee, BigDecimal discountAmount, BigDecimal totalAmount, String currency, String validUntil) {
        this.quoteId = quoteId;
        this.roomId = roomId;
        this.numberOfNights = numberOfNights;
        this.basePricePerNight = basePricePerNight;
        this.appliedPricePerNight = appliedPricePerNight;
        this.roomAmount = roomAmount;
        this.taxPercentage = taxPercentage;
        this.taxAmount = taxAmount;
        this.serviceFeePercentage = serviceFeePercentage;
        this.serviceFee = serviceFee;
        this.discountAmount = discountAmount;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.validUntil = validUntil;
    }

    public String getQuoteId() { return quoteId; }
    public void setQuoteId(String quoteId) { this.quoteId = quoteId; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public int getNumberOfNights() { return numberOfNights; }
    public void setNumberOfNights(int numberOfNights) { this.numberOfNights = numberOfNights; }

    public BigDecimal getBasePricePerNight() { return basePricePerNight; }
    public void setBasePricePerNight(BigDecimal basePricePerNight) { this.basePricePerNight = basePricePerNight; }

    public BigDecimal getAppliedPricePerNight() { return appliedPricePerNight; }
    public void setAppliedPricePerNight(BigDecimal appliedPricePerNight) { this.appliedPricePerNight = appliedPricePerNight; }

    public BigDecimal getRoomAmount() { return roomAmount; }
    public void setRoomAmount(BigDecimal roomAmount) { this.roomAmount = roomAmount; }

    public double getTaxPercentage() { return taxPercentage; }
    public void setTaxPercentage(double taxPercentage) { this.taxPercentage = taxPercentage; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public double getServiceFeePercentage() { return serviceFeePercentage; }
    public void setServiceFeePercentage(double serviceFeePercentage) { this.serviceFeePercentage = serviceFeePercentage; }

    public BigDecimal getServiceFee() { return serviceFee; }
    public void setServiceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getValidUntil() { return validUntil; }
    public void setValidUntil(String validUntil) { this.validUntil = validUntil; }

    public static BookingQuoteDtoBuilder builder() {
        return new BookingQuoteDtoBuilder();
    }

    public static class BookingQuoteDtoBuilder {
        private String quoteId;
        private Long roomId;
        private int numberOfNights;
        private BigDecimal basePricePerNight;
        private BigDecimal appliedPricePerNight;
        private BigDecimal roomAmount;
        private double taxPercentage;
        private BigDecimal taxAmount;
        private double serviceFeePercentage;
        private BigDecimal serviceFee;
        private BigDecimal discountAmount;
        private BigDecimal totalAmount;
        private String currency;
        private String validUntil;

        public BookingQuoteDtoBuilder quoteId(String quoteId) { this.quoteId = quoteId; return this; }
        public BookingQuoteDtoBuilder roomId(Long roomId) { this.roomId = roomId; return this; }
        public BookingQuoteDtoBuilder numberOfNights(int numberOfNights) { this.numberOfNights = numberOfNights; return this; }
        public BookingQuoteDtoBuilder basePricePerNight(BigDecimal basePricePerNight) { this.basePricePerNight = basePricePerNight; return this; }
        public BookingQuoteDtoBuilder appliedPricePerNight(BigDecimal appliedPricePerNight) { this.appliedPricePerNight = appliedPricePerNight; return this; }
        public BookingQuoteDtoBuilder roomAmount(BigDecimal roomAmount) { this.roomAmount = roomAmount; return this; }
        public BookingQuoteDtoBuilder taxPercentage(double taxPercentage) { this.taxPercentage = taxPercentage; return this; }
        public BookingQuoteDtoBuilder taxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; return this; }
        public BookingQuoteDtoBuilder serviceFeePercentage(double serviceFeePercentage) { this.serviceFeePercentage = serviceFeePercentage; return this; }
        public BookingQuoteDtoBuilder serviceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; return this; }
        public BookingQuoteDtoBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public BookingQuoteDtoBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public BookingQuoteDtoBuilder currency(String currency) { this.currency = currency; return this; }
        public BookingQuoteDtoBuilder validUntil(String validUntil) { this.validUntil = validUntil; return this; }

        public BookingQuoteDto build() {
            return new BookingQuoteDto(quoteId, roomId, numberOfNights, basePricePerNight, appliedPricePerNight, roomAmount, taxPercentage, taxAmount, serviceFeePercentage, serviceFee, discountAmount, totalAmount, currency, validUntil);
        }
    }
}
