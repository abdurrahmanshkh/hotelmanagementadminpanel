package com.smartstay.dto.payment;

import com.smartstay.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProcessPaymentRequestDto {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String paymentToken;
    private String dummyPaymentToken;
    private String cardHolderName;
    private String upiId;
}
