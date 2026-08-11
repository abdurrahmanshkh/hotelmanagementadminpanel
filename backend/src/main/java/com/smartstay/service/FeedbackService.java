package com.smartstay.service;

import com.smartstay.dto.feedback.FeedbackDto;
import com.smartstay.dto.feedback.SubmitFeedbackRequestDto;
import com.smartstay.enums.BookingStatus;
import com.smartstay.exception.BusinessRuleException;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.Booking;
import com.smartstay.model.Feedback;
import com.smartstay.model.User;
import com.smartstay.repository.BookingRepository;
import com.smartstay.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final BookingRepository bookingRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, BookingRepository bookingRepository) {
        this.feedbackRepository = feedbackRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public FeedbackDto submitFeedback(User user, SubmitFeedbackRequestDto req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + req.getBookingId()));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BusinessRuleException("Unauthorized to submit feedback for this booking");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BusinessRuleException("Feedback can only be submitted for completed stays");
        }

        if (!feedbackRepository.findByBookingId(booking.getId()).isEmpty()) {
            throw new BusinessRuleException("Feedback has already been submitted for this booking");
        }

        Feedback feedback = Feedback.builder()
                .booking(booking)
                .user(user)
                .rating(req.getRating())
                .cleanlinessRating(req.getCleanlinessRating())
                .serviceRating(req.getServiceRating())
                .comfortRating(req.getComfortRating())
                .comments(req.getComments())
                .visible(true)
                .build();

        feedback = feedbackRepository.save(feedback);
        return FeedbackDto.fromEntity(feedback);
    }

    @Transactional(readOnly = true)
    public List<FeedbackDto> getCustomerFeedback(Long userId) {
        return feedbackRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(FeedbackDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeedbackDto> getAllFeedback() {
        return feedbackRepository.findAll().stream()
                .map(FeedbackDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackDto toggleVisibility(Long feedbackId, boolean visible) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + feedbackId));

        feedback.setVisible(visible);
        feedback = feedbackRepository.save(feedback);
        return FeedbackDto.fromEntity(feedback);
    }
}
