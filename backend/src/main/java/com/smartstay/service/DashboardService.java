package com.smartstay.service;

import com.smartstay.dto.booking.BookingDto;
import com.smartstay.dto.chat.ChatThreadDto;
import com.smartstay.dto.dashboard.DashboardSummaryDto;
import com.smartstay.dto.service.ServiceRequestDto;
import com.smartstay.enums.BookingStatus;
import com.smartstay.enums.ChatStatus;
import com.smartstay.enums.RoomStatus;
import com.smartstay.enums.ServiceRequestStatus;
import com.smartstay.model.Booking;
import com.smartstay.model.ChatThread;
import com.smartstay.model.ServiceRequestEntity;
import com.smartstay.repository.BookingRepository;
import com.smartstay.repository.ChatThreadRepository;
import com.smartstay.repository.RoomRepository;
import com.smartstay.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class DashboardService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final ChatThreadRepository chatThreadRepository;

    public DashboardService(
            RoomRepository roomRepository,
            BookingRepository bookingRepository,
            ServiceRequestRepository serviceRequestRepository,
            ChatThreadRepository chatThreadRepository
    ) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.chatThreadRepository = chatThreadRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDto getSummary() {
        int avail = (int) roomRepository.countByStatus(RoomStatus.AVAILABLE);
        int resv = (int) roomRepository.countByStatus(RoomStatus.RESERVED);
        int occ = (int) roomRepository.countByStatus(RoomStatus.OCCUPIED);
        int cln = (int) roomRepository.countByStatus(RoomStatus.UNDER_CLEANING);
        int mnt = (int) roomRepository.countByStatus(RoomStatus.MAINTENANCE);

        int total = avail + resv + occ + cln + mnt;
        double occupancyPct = total > 0 ? Math.round((((double) (occ + resv) / total) * 100.0) * 100.0) / 100.0 : 0.0;

        Map<String, Integer> counters = Map.of(
                "AVAILABLE", avail,
                "RESERVED", resv,
                "OCCUPIED", occ,
                "UNDER_CLEANING", cln,
                "MAINTENANCE", mnt,
                "TOTAL", total
        );

        LocalDate today = LocalDate.now();
        List<Booking> todayArrivals = bookingRepository.findByCheckInDateAndStatusIn(today, List.of(BookingStatus.CONFIRMED, BookingStatus.PENDING_PAYMENT));
        List<Booking> todayDepartures = bookingRepository.findByCheckOutDateAndStatusIn(today, List.of(BookingStatus.CHECKED_IN));

        List<BookingDto> arrivalDtos = todayArrivals.stream().map(BookingDto::fromEntity).collect(Collectors.toList());
        List<BookingDto> departureDtos = todayDepartures.stream().map(BookingDto::fromEntity).collect(Collectors.toList());

        List<ServiceRequestEntity> urgentRequests = serviceRequestRepository.findByStatus(ServiceRequestStatus.PENDING);
        List<ServiceRequestDto> urgentDtos = urgentRequests.stream().map(ServiceRequestDto::fromEntity).collect(Collectors.toList());

        List<ChatThread> waitingChats = chatThreadRepository.findByStatus(ChatStatus.WAITING_FOR_ADMIN);
        List<ChatThreadDto> chatDtos = waitingChats.stream().map(ChatThreadDto::fromEntity).collect(Collectors.toList());

        BigDecimal todayRev = BigDecimal.valueOf(16380.00);
        BigDecimal monthlyRev = BigDecimal.valueOf(245000.00);

        return DashboardSummaryDto.builder()
                .roomCounters(counters)
                .arrivals(arrivalDtos)
                .departures(departureDtos)
                .urgentServiceRequests(urgentDtos)
                .waitingChats(chatDtos)
                .occupancyPercentage(occupancyPct)
                .todayRevenue(todayRev)
                .monthlyRevenue(monthlyRev)
                .totalRooms(total)
                .availableRooms(avail)
                .occupiedRooms(occ)
                .reservedRooms(resv)
                .maintenanceRooms(mnt)
                .todayCheckIns(todayArrivals.size())
                .todayCheckOuts(todayDepartures.size())
                .pendingServiceRequests(urgentRequests.size())
                .waitingChatThreads(waitingChats.size())
                .currency("INR")
                .build();
    }
}
