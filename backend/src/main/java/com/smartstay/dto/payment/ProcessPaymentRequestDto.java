package com.smartstay.dto.payment;

import com.smartstay.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public class ProcessPaymentRequestDto {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String paymentToken;
    private String dummyPaymentToken;
    private String cardHolderName;
    private String upiId;

    public ProcessPaymentRequestDto() {
    }

    public ProcessPaymentRequestDto(Long bookingId, PaymentMethod paymentMethod, String paymentToken, String dummyPaymentToken, String cardHolderName, String upiId) {
        this.bookingId = bookingId;
        this.paymentMethod = paymentMethod;
        this.paymentToken = paymentToken;
        this.dummyPaymentToken = dummyPaymentToken;
        this.cardHolderName = cardHolderName;
        this.upiId = upiId;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentToken() { return paymentToken; }
    public void setPaymentToken(String paymentToken) { this.paymentToken = paymentToken; }

    public String getDummyPaymentToken() { return dummyPaymentToken; }
    public void setDummyPaymentToken(String dummyPaymentToken) { this.dummyPaymentToken = dummyPaymentToken; }

    public String getCardHolderName() { return cardHolderName; }
    public void setCardHolderName(String cardHolderName) { this.cardHolderName = cardHolderName; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
}
