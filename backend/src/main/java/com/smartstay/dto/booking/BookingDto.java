package com.smartstay.dto.booking;

import com.smartstay.enums.BookingStatus;
import com.smartstay.enums.PaymentStatus;
import com.smartstay.model.Booking;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

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

    public BookingDto() {
    }

    public BookingDto(Long id, String bookingReference, Long userId, Long guestId, String guestName, String guestEmail, String guestPhone, Long roomId, String roomNumber, String roomTypeName, Object room, String checkInDate, String checkOutDate, String expectedCheckInAt, String expectedCheckOutAt, String actualCheckInAt, String actualCheckOutAt, int adults, int children, int guestCount, int numberOfNights, BookingStatus status, PaymentStatus paymentStatus, BigDecimal basePricePerNight, BigDecimal appliedPricePerNight, BigDecimal roomAmount, BigDecimal taxAmount, BigDecimal serviceFee, BigDecimal discountAmount, BigDecimal totalAmount, String currency, String specialRequests, String cancellationReason, String passcode, String createdAt, String updatedAt) {
        this.id = id;
        this.bookingReference = bookingReference;
        this.userId = userId;
        this.guestId = guestId;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.guestPhone = guestPhone;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomTypeName = roomTypeName;
        this.room = room;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.expectedCheckInAt = expectedCheckInAt;
        this.expectedCheckOutAt = expectedCheckOutAt;
        this.actualCheckInAt = actualCheckInAt;
        this.actualCheckOutAt = actualCheckOutAt;
        this.adults = adults;
        this.children = children;
        this.guestCount = guestCount;
        this.numberOfNights = numberOfNights;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.basePricePerNight = basePricePerNight;
        this.appliedPricePerNight = appliedPricePerNight;
        this.roomAmount = roomAmount;
        this.taxAmount = taxAmount;
        this.serviceFee = serviceFee;
        this.discountAmount = discountAmount;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.specialRequests = specialRequests;
        this.cancellationReason = cancellationReason;
        this.passcode = passcode;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getGuestId() { return guestId; }
    public void setGuestId(Long guestId) { this.guestId = guestId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomTypeName() { return roomTypeName; }
    public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }

    public Object getRoom() { return room; }
    public void setRoom(Object room) { this.room = room; }

    public String getCheckInDate() { return checkInDate; }
    public void setCheckInDate(String checkInDate) { this.checkInDate = checkInDate; }

    public String getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(String checkOutDate) { this.checkOutDate = checkOutDate; }

    public String getExpectedCheckInAt() { return expectedCheckInAt; }
    public void setExpectedCheckInAt(String expectedCheckInAt) { this.expectedCheckInAt = expectedCheckInAt; }

    public String getExpectedCheckOutAt() { return expectedCheckOutAt; }
    public void setExpectedCheckOutAt(String expectedCheckOutAt) { this.expectedCheckOutAt = expectedCheckOutAt; }

    public String getActualCheckInAt() { return actualCheckInAt; }
    public void setActualCheckInAt(String actualCheckInAt) { this.actualCheckInAt = actualCheckInAt; }

    public String getActualCheckOutAt() { return actualCheckOutAt; }
    public void setActualCheckOutAt(String actualCheckOutAt) { this.actualCheckOutAt = actualCheckOutAt; }

    public int getAdults() { return adults; }
    public void setAdults(int adults) { this.adults = adults; }

    public int getChildren() { return children; }
    public void setChildren(int children) { this.children = children; }

    public int getGuestCount() { return guestCount; }
    public void setGuestCount(int guestCount) { this.guestCount = guestCount; }

    public int getNumberOfNights() { return numberOfNights; }
    public void setNumberOfNights(int numberOfNights) { this.numberOfNights = numberOfNights; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public BigDecimal getBasePricePerNight() { return basePricePerNight; }
    public void setBasePricePerNight(BigDecimal basePricePerNight) { this.basePricePerNight = basePricePerNight; }

    public BigDecimal getAppliedPricePerNight() { return appliedPricePerNight; }
    public void setAppliedPricePerNight(BigDecimal appliedPricePerNight) { this.appliedPricePerNight = appliedPricePerNight; }

    public BigDecimal getRoomAmount() { return roomAmount; }
    public void setRoomAmount(BigDecimal roomAmount) { this.roomAmount = roomAmount; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getServiceFee() { return serviceFee; }
    public void setServiceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public String getPasscode() { return passcode; }
    public void setPasscode(String passcode) { this.passcode = passcode; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

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

    public static BookingDtoBuilder builder() {
        return new BookingDtoBuilder();
    }

    public static class BookingDtoBuilder {
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

        public BookingDtoBuilder id(Long id) { this.id = id; return this; }
        public BookingDtoBuilder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }
        public BookingDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public BookingDtoBuilder guestId(Long guestId) { this.guestId = guestId; return this; }
        public BookingDtoBuilder guestName(String guestName) { this.guestName = guestName; return this; }
        public BookingDtoBuilder guestEmail(String guestEmail) { this.guestEmail = guestEmail; return this; }
        public BookingDtoBuilder guestPhone(String guestPhone) { this.guestPhone = guestPhone; return this; }
        public BookingDtoBuilder roomId(Long roomId) { this.roomId = roomId; return this; }
        public BookingDtoBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public BookingDtoBuilder roomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; return this; }
        public BookingDtoBuilder room(Object room) { this.room = room; return this; }
        public BookingDtoBuilder checkInDate(String checkInDate) { this.checkInDate = checkInDate; return this; }
        public BookingDtoBuilder checkOutDate(String checkOutDate) { this.checkOutDate = checkOutDate; return this; }
        public BookingDtoBuilder expectedCheckInAt(String expectedCheckInAt) { this.expectedCheckInAt = expectedCheckInAt; return this; }
        public BookingDtoBuilder expectedCheckOutAt(String expectedCheckOutAt) { this.expectedCheckOutAt = expectedCheckOutAt; return this; }
        public BookingDtoBuilder actualCheckInAt(String actualCheckInAt) { this.actualCheckInAt = actualCheckInAt; return this; }
        public BookingDtoBuilder actualCheckOutAt(String actualCheckOutAt) { this.actualCheckOutAt = actualCheckOutAt; return this; }
        public BookingDtoBuilder adults(int adults) { this.adults = adults; return this; }
        public BookingDtoBuilder children(int children) { this.children = children; return this; }
        public BookingDtoBuilder guestCount(int guestCount) { this.guestCount = guestCount; return this; }
        public BookingDtoBuilder numberOfNights(int numberOfNights) { this.numberOfNights = numberOfNights; return this; }
        public BookingDtoBuilder status(BookingStatus status) { this.status = status; return this; }
        public BookingDtoBuilder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public BookingDtoBuilder basePricePerNight(BigDecimal basePricePerNight) { this.basePricePerNight = basePricePerNight; return this; }
        public BookingDtoBuilder appliedPricePerNight(BigDecimal appliedPricePerNight) { this.appliedPricePerNight = appliedPricePerNight; return this; }
        public BookingDtoBuilder roomAmount(BigDecimal roomAmount) { this.roomAmount = roomAmount; return this; }
        public BookingDtoBuilder taxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; return this; }
        public BookingDtoBuilder serviceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; return this; }
        public BookingDtoBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public BookingDtoBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public BookingDtoBuilder currency(String currency) { this.currency = currency; return this; }
        public BookingDtoBuilder specialRequests(String specialRequests) { this.specialRequests = specialRequests; return this; }
        public BookingDtoBuilder cancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; return this; }
        public BookingDtoBuilder passcode(String passcode) { this.passcode = passcode; return this; }
        public BookingDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public BookingDtoBuilder updatedAt(String updatedAt) { this.updatedAt = updatedAt; return this; }

        public BookingDto build() {
            return new BookingDto(id, bookingReference, userId, guestId, guestName, guestEmail, guestPhone, roomId, roomNumber, roomTypeName, room, checkInDate, checkOutDate, expectedCheckInAt, expectedCheckOutAt, actualCheckInAt, actualCheckOutAt, adults, children, guestCount, numberOfNights, status, paymentStatus, basePricePerNight, appliedPricePerNight, roomAmount, taxAmount, serviceFee, discountAmount, totalAmount, currency, specialRequests, cancellationReason, passcode, createdAt, updatedAt);
        }
    }
}
