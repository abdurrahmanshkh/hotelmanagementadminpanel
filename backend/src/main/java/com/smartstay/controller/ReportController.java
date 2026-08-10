package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.report.*;
import com.smartstay.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<RevenueReportDto>> getRevenueReport(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        RevenueReportDto report = reportService.getRevenueReport(fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.ok("Revenue report generated", report));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<BookingReportDto>> getBookingReport(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        BookingReportDto report = reportService.getBookingReport(fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.ok("Booking report generated", report));
    }

    @GetMapping("/occupancy")
    public ResponseEntity<ApiResponse<OccupancyReportDto>> getOccupancyReport(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        OccupancyReportDto report = reportService.getOccupancyReport(fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.ok("Occupancy report generated", report));
    }

    @GetMapping("/services")
    public ResponseEntity<ApiResponse<ServiceReportDto>> getServiceReport(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        ServiceReportDto report = reportService.getServiceReport(fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.ok("Service report generated", report));
    }

    @GetMapping(value = "/revenue/export", produces = "text/csv")
    public ResponseEntity<String> exportRevenueCsv(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        String csvData = reportService.generateRevenueCsv(fromDate, toDate);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=revenue-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @GetMapping(value = "/bookings/export", produces = "text/csv")
    public ResponseEntity<String> exportBookingsCsv(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        String csvData = reportService.generateBookingsCsv(fromDate, toDate);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bookings-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
