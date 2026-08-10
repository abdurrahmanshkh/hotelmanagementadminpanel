package com.smartstay.dto.booking;

import com.smartstay.enums.BookingStatus;
import com.smartstay.enums.PaymentStatus;
import com.smartstay.model.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {

    private Long id;
    private String bookingReference;
    private Long userId;
    private Long guestId;
    private String guestName;
    private String guestEmail;
    private String guestPhone;

    private Long roomId;
    private String roomNumber;
    private String roomTypeName;
    private Object room;

    private String checkInDate;
    private String checkOutDate;
    private String expectedCheckInAt;
    private String expectedCheckOutAt;
    private String actualCheckInAt;
    private String actualCheckOutAt;

    private int adults;
    private int children;
    private int guestCount;
    private int numberOfNights;

    private BookingStatus status;
    private PaymentStatus paymentStatus;

    private BigDecimal basePricePerNight;
    private BigDecimal appliedPricePerNight;
    private BigDecimal roomAmount;
    private BigDecimal taxAmount;
    private BigDecimal serviceFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String currency;

    private String specialRequests;
    private String cancellationReason;
    private String passcode;

    private String createdAt;
    private String updatedAt;

    public static BookingDto fromEntity(Booking booking) {
        if (booking == null) return null;

        String gName = booking.getUser() != null ? booking.getUser().getFullName() : "Guest";
        String gEmail = booking.getUser() != null ? booking.getUser().getEmail() : "";
        String gPhone = booking.getUser() != null ? booking.getUser().getPhone() : "";

        String rNum = booking.getRoom() != null ? booking.getRoom().getRoomNumber() : "";
        String rTypeName = (booking.getRoom() != null && booking.getRoom().getRoomType() != null) ? booking.getRoom().getRoomType().getName() : "";
        String pImgUrl = (booking.getRoom() != null && booking.getRoom().getImageUrl() != null) ? booking.getRoom().getImageUrl() : "";

        // Minimal RoomSummary object for customer frontend
        java.util.Map<String, Object> roomSummaryMap = java.util.Map.of(
                "id", booking.getRoom() != null ? booking.getRoom().getId() : 0L,
                "publicId", booking.getRoom() != null ? booking.getRoom().getPublicId() : "",
                "roomNumber", rNum,
                "roomTypeName", rTypeName,
                "primaryImageUrl", pImgUrl
        );

        PaymentStatus pStatus = (booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.CHECKED_IN || booking.getStatus() == BookingStatus.COMPLETED)
                ? PaymentStatus.SUCCESS
                : (booking.getStatus() == BookingStatus.CANCELLED ? PaymentStatus.REFUNDED : PaymentStatus.PENDING);

        return BookingDto.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .guestId(booking.getUser() != null ? booking.getUser().getId() : null)
                .guestName(gName)
                .guestEmail(gEmail)
                .guestPhone(gPhone)
                .roomId(booking.getRoom() != null ? booking.getRoom().getId() : null)
                .roomNumber(rNum)
                .roomTypeName(rTypeName)
                .room(roomSummaryMap)
                .checkInDate(booking.getCheckInDate() != null ? booking.getCheckInDate().toString() : null)
                .checkOutDate(booking.getCheckOutDate() != null ? booking.getCheckOutDate().toString() : null)
                .expectedCheckInAt(booking.getExpectedCheckInAt() != null ? booking.getExpectedCheckInAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .expectedCheckOutAt(booking.getExpectedCheckOutAt() != null ? booking.getExpectedCheckOutAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .actualCheckInAt(booking.getActualCheckInAt() != null ? booking.getActualCheckInAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .actualCheckOutAt(booking.getActualCheckOutAt() != null ? booking.getActualCheckOutAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .adults(booking.getAdults() != null ? booking.getAdults() : 1)
                .children(booking.getChildren() != null ? booking.getChildren() : 0)
                .guestCount(booking.getGuestCount() != null ? booking.getGuestCount() : 1)
                .numberOfNights(booking.getNumberOfNights() != null ? booking.getNumberOfNights() : 1)
                .status(booking.getStatus())
                .paymentStatus(pStatus)
                .basePricePerNight(booking.getBasePricePerNight())
                .appliedPricePerNight(booking.getAppliedPricePerNight())
                .roomAmount(booking.getRoomAmount())
                .taxAmount(booking.getTaxAmount())
                .serviceFee(booking.getServiceFee())
                .discountAmount(booking.getDiscountAmount())
                .totalAmount(booking.getTotalAmount())
                .currency(booking.getCurrency() != null ? booking.getCurrency() : "INR")
                .specialRequests(booking.getSpecialRequests())
                .cancellationReason(booking.getCancellationReason())
                .createdAt(booking.getCreatedAt() != null ? booking.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .updatedAt(booking.getUpdatedAt() != null ? booking.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
