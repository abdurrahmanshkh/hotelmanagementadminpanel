package com.smartstay.repository;

import com.smartstay.enums.PaymentMethod;
import com.smartstay.enums.PaymentStatus;
import com.smartstay.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentReference(String paymentReference);

    Optional<Payment> findByBookingId(Long bookingId);

    List<Payment> findByBookingIdAndStatus(Long bookingId, PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE " +
           "(:query IS NULL OR LOWER(p.paymentReference) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.booking.bookingReference) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.user.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.user.lastName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:method IS NULL OR p.method = :method) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:fromDate IS NULL OR p.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR p.createdAt <= :toDate)")
    Page<Payment> searchPayments(
            @Param("query") String query,
            @Param("method") PaymentMethod method,
            @Param("status") PaymentStatus status,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
