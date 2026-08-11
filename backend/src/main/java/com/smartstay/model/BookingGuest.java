package com.smartstay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "booking_guests")
public class BookingGuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender")
    private String gender;

    @Column(name = "primary_guest")
    private Boolean primaryGuest = false;

    @Column(name = "government_id_type")
    private String governmentIdType;

    @Column(name = "government_id_last_four")
    private String governmentIdLastFour;

    public BookingGuest() {
    }

    public BookingGuest(Long id, Booking booking, String fullName, Integer age, String gender, Boolean primaryGuest, String governmentIdType, String governmentIdLastFour) {
        this.id = id;
        this.booking = booking;
        this.fullName = fullName;
        this.age = age;
        this.gender = gender;
        this.primaryGuest = primaryGuest != null ? primaryGuest : false;
        this.governmentIdType = governmentIdType;
        this.governmentIdLastFour = governmentIdLastFour;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Boolean getPrimaryGuest() {
        return primaryGuest;
    }

    public void setPrimaryGuest(Boolean primaryGuest) {
        this.primaryGuest = primaryGuest;
    }

    public String getGovernmentIdType() {
        return governmentIdType;
    }

    public void setGovernmentIdType(String governmentIdType) {
        this.governmentIdType = governmentIdType;
    }

    public String getGovernmentIdLastFour() {
        return governmentIdLastFour;
    }

    public void setGovernmentIdLastFour(String governmentIdLastFour) {
        this.governmentIdLastFour = governmentIdLastFour;
    }

    public static BookingGuestBuilder builder() {
        return new BookingGuestBuilder();
    }

    public static class BookingGuestBuilder {
        private Long id;
        private Booking booking;
        private String fullName;
        private Integer age;
        private String gender;
        private Boolean primaryGuest = false;
        private String governmentIdType;
        private String governmentIdLastFour;

        public BookingGuestBuilder id(Long id) { this.id = id; return this; }
        public BookingGuestBuilder booking(Booking booking) { this.booking = booking; return this; }
        public BookingGuestBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public BookingGuestBuilder age(Integer age) { this.age = age; return this; }
        public BookingGuestBuilder gender(String gender) { this.gender = gender; return this; }
        public BookingGuestBuilder primaryGuest(Boolean primaryGuest) { this.primaryGuest = primaryGuest; return this; }
        public BookingGuestBuilder governmentIdType(String governmentIdType) { this.governmentIdType = governmentIdType; return this; }
        public BookingGuestBuilder governmentIdLastFour(String governmentIdLastFour) { this.governmentIdLastFour = governmentIdLastFour; return this; }

        public BookingGuest build() {
            return new BookingGuest(id, booking, fullName, age, gender, primaryGuest, governmentIdType, governmentIdLastFour);
        }
    }
}
