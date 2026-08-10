package com.smartstay.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booking_guests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    @Builder.Default
    private Boolean primaryGuest = false;

    @Column(name = "government_id_type")
    private String governmentIdType;

    @Column(name = "government_id_last_four")
    private String governmentIdLastFour;
}
