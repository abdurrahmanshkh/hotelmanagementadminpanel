package com.smartstay.repository;

import com.smartstay.model.Refund;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByPaymentId(Long paymentId);
    List<Refund> findByBookingId(Long bookingId);
}
