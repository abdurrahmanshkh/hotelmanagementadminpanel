package com.smartstay.model;

import com.smartstay.enums.BookingStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference", nullable = false, unique = true)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "expected_check_in_at")
    private LocalDateTime expectedCheckInAt;

    @Column(name = "expected_check_out_at")
    private LocalDateTime expectedCheckOutAt;

    @Column(name = "actual_check_in_at")
    private LocalDateTime actualCheckInAt;

    @Column(name = "actual_check_out_at")
    private LocalDateTime actualCheckOutAt;

    @Column(name = "guest_count", nullable = false)
    private Integer guestCount;

    @Column(name = "adults", nullable = false)
    private Integer adults;

    @Column(name = "children", nullable = false)
    private Integer children = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    @Column(name = "base_price_per_night", nullable = false, precision = 12, scale = 2)
    private BigDecimal basePricePerNight;

    @Column(name = "applied_price_per_night", nullable = false, precision = 12, scale = 2)
    private BigDecimal appliedPricePerNight;

    @Column(name = "number_of_nights", nullable = false)
    private Integer numberOfNights;

    @Column(name = "room_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal roomAmount;

    @Column(name = "tax_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "service_fee", nullable = false, precision = 12, scale = 2)
    private BigDecimal serviceFee;

    @Column(name = "discount_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", nullable = false)
    private String currency = "INR";

    @Column(name = "special_requests", length = 1000)
    private String specialRequests;

    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BookingGuest> guests = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Booking() {
    }

    public Booking(Long id, String bookingReference, User user, Room room, LocalDate checkInDate, LocalDate checkOutDate, LocalDateTime expectedCheckInAt, LocalDateTime expectedCheckOutAt, LocalDateTime actualCheckInAt, LocalDateTime actualCheckOutAt, Integer guestCount, Integer adults, Integer children, BookingStatus status, BigDecimal basePricePerNight, BigDecimal appliedPricePerNight, Integer numberOfNights, BigDecimal roomAmount, BigDecimal taxAmount, BigDecimal serviceFee, BigDecimal discountAmount, BigDecimal totalAmount, String currency, String specialRequests, String cancellationReason, LocalDateTime cancelledAt, List<BookingGuest> guests, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.bookingReference = bookingReference;
        this.user = user;
        this.room = room;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.expectedCheckInAt = expectedCheckInAt;
        this.expectedCheckOutAt = expectedCheckOutAt;
        this.actualCheckInAt = actualCheckInAt;
        this.actualCheckOutAt = actualCheckOutAt;
        this.guestCount = guestCount;
        this.adults = adults;
        this.children = children != null ? children : 0;
        this.status = status != null ? status : BookingStatus.PENDING_PAYMENT;
        this.basePricePerNight = basePricePerNight;
        this.appliedPricePerNight = appliedPricePerNight;
        this.numberOfNights = numberOfNights;
        this.roomAmount = roomAmount;
        this.taxAmount = taxAmount;
        this.serviceFee = serviceFee;
        this.discountAmount = discountAmount != null ? discountAmount : BigDecimal.ZERO;
        this.totalAmount = totalAmount;
        this.currency = currency != null ? currency : "INR";
        this.specialRequests = specialRequests;
        this.cancellationReason = cancellationReason;
        this.cancelledAt = cancelledAt;
        this.guests = guests != null ? guests : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = BookingStatus.PENDING_PAYMENT;
        if (this.children == null) this.children = 0;
        if (this.discountAmount == null) this.discountAmount = BigDecimal.ZERO;
        if (this.currency == null) this.currency = "INR";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public LocalDateTime getExpectedCheckInAt() {
        return expectedCheckInAt;
    }

    public void setExpectedCheckInAt(LocalDateTime expectedCheckInAt) {
        this.expectedCheckInAt = expectedCheckInAt;
    }

    public LocalDateTime getExpectedCheckOutAt() {
        return expectedCheckOutAt;
    }

    public void setExpectedCheckOutAt(LocalDateTime expectedCheckOutAt) {
        this.expectedCheckOutAt = expectedCheckOutAt;
    }

    public LocalDateTime getActualCheckInAt() {
        return actualCheckInAt;
    }

    public void setActualCheckInAt(LocalDateTime actualCheckInAt) {
        this.actualCheckInAt = actualCheckInAt;
    }

    public LocalDateTime getActualCheckOutAt() {
        return actualCheckOutAt;
    }

    public void setActualCheckOutAt(LocalDateTime actualCheckOutAt) {
        this.actualCheckOutAt = actualCheckOutAt;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public Integer getAdults() {
        return adults;
    }

    public void setAdults(Integer adults) {
        this.adults = adults;
    }

    public Integer getChildren() {
        return children;
    }

    public void setChildren(Integer children) {
        this.children = children;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public BigDecimal getBasePricePerNight() {
        return basePricePerNight;
    }

    public void setBasePricePerNight(BigDecimal basePricePerNight) {
        this.basePricePerNight = basePricePerNight;
    }

    public BigDecimal getAppliedPricePerNight() {
        return appliedPricePerNight;
    }

    public void setAppliedPricePerNight(BigDecimal appliedPricePerNight) {
        this.appliedPricePerNight = appliedPricePerNight;
    }

    public Integer getNumberOfNights() {
        return numberOfNights;
    }

    public void setNumberOfNights(Integer numberOfNights) {
        this.numberOfNights = numberOfNights;
    }

    public BigDecimal getRoomAmount() {
        return roomAmount;
    }

    public void setRoomAmount(BigDecimal roomAmount) {
        this.roomAmount = roomAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getServiceFee() {
        return serviceFee;
    }

    public void setServiceFee(BigDecimal serviceFee) {
        this.serviceFee = serviceFee;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public List<BookingGuest> getGuests() {
        return guests;
    }

    public void setGuests(List<BookingGuest> guests) {
        this.guests = guests;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private Long id;
        private String bookingReference;
        private User user;
        private Room room;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private LocalDateTime expectedCheckInAt;
        private LocalDateTime expectedCheckOutAt;
        private LocalDateTime actualCheckInAt;
        private LocalDateTime actualCheckOutAt;
        private Integer guestCount;
        private Integer adults;
        private Integer children = 0;
        private BookingStatus status = BookingStatus.PENDING_PAYMENT;
        private BigDecimal basePricePerNight;
        private BigDecimal appliedPricePerNight;
        private Integer numberOfNights;
        private BigDecimal roomAmount;
        private BigDecimal taxAmount;
        private BigDecimal serviceFee;
        private BigDecimal discountAmount = BigDecimal.ZERO;
        private BigDecimal totalAmount;
        private String currency = "INR";
        private String specialRequests;
        private String cancellationReason;
        private LocalDateTime cancelledAt;
        private List<BookingGuest> guests = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public BookingBuilder id(Long id) { this.id = id; return this; }
        public BookingBuilder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }
        public BookingBuilder user(User user) { this.user = user; return this; }
        public BookingBuilder room(Room room) { this.room = room; return this; }
        public BookingBuilder checkInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; return this; }
        public BookingBuilder checkOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; return this; }
        public BookingBuilder expectedCheckInAt(LocalDateTime expectedCheckInAt) { this.expectedCheckInAt = expectedCheckInAt; return this; }
        public BookingBuilder expectedCheckOutAt(LocalDateTime expectedCheckOutAt) { this.expectedCheckOutAt = expectedCheckOutAt; return this; }
        public BookingBuilder actualCheckInAt(LocalDateTime actualCheckInAt) { this.actualCheckInAt = actualCheckInAt; return this; }
        public BookingBuilder actualCheckOutAt(LocalDateTime actualCheckOutAt) { this.actualCheckOutAt = actualCheckOutAt; return this; }
        public BookingBuilder guestCount(Integer guestCount) { this.guestCount = guestCount; return this; }
        public BookingBuilder adults(Integer adults) { this.adults = adults; return this; }
        public BookingBuilder children(Integer children) { this.children = children; return this; }
        public BookingBuilder status(BookingStatus status) { this.status = status; return this; }
        public BookingBuilder basePricePerNight(BigDecimal basePricePerNight) { this.basePricePerNight = basePricePerNight; return this; }
        public BookingBuilder appliedPricePerNight(BigDecimal appliedPricePerNight) { this.appliedPricePerNight = appliedPricePerNight; return this; }
        public BookingBuilder numberOfNights(Integer numberOfNights) { this.numberOfNights = numberOfNights; return this; }
        public BookingBuilder roomAmount(BigDecimal roomAmount) { this.roomAmount = roomAmount; return this; }
        public BookingBuilder taxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; return this; }
        public BookingBuilder serviceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; return this; }
        public BookingBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public BookingBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public BookingBuilder currency(String currency) { this.currency = currency; return this; }
        public BookingBuilder specialRequests(String specialRequests) { this.specialRequests = specialRequests; return this; }
        public BookingBuilder cancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; return this; }
        public BookingBuilder cancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; return this; }
        public BookingBuilder guests(List<BookingGuest> guests) { this.guests = guests; return this; }
        public BookingBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public BookingBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Booking build() {
            return new Booking(id, bookingReference, user, room, checkInDate, checkOutDate, expectedCheckInAt, expectedCheckOutAt, actualCheckInAt, actualCheckOutAt, guestCount, adults, children, status, basePricePerNight, appliedPricePerNight, numberOfNights, roomAmount, taxAmount, serviceFee, discountAmount, totalAmount, currency, specialRequests, cancellationReason, cancelledAt, guests, createdAt, updatedAt);
        }
    }
}
