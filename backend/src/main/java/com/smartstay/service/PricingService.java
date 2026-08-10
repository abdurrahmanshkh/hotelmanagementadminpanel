package com.smartstay.service;

import com.smartstay.config.AppProperties;
import com.smartstay.dto.pricing.*;
import com.smartstay.enums.BookingStatus;
import com.smartstay.enums.PricingAdjustmentType;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.HotelSettings;
import com.smartstay.model.PriceSnapshot;
import com.smartstay.model.PricingRule;
import com.smartstay.model.RoomType;
import com.smartstay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PricingService {

    private final PricingRuleRepository pricingRuleRepository;
    private final PriceSnapshotRepository priceSnapshotRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final HotelSettingsRepository hotelSettingsRepository;
    private final AppProperties appProperties;

    @Transactional(readOnly = true)
    public BigDecimal calculateNightlyPrice(RoomType roomType, LocalDate date) {
        HotelSettings settings = hotelSettingsRepository.findById(1L).orElse(null);
        boolean dynamicEnabled = settings == null || Boolean.TRUE.equals(settings.getIsDynamicPricingEnabled());

        BigDecimal basePrice = roomType.getBasePrice();
        if (!dynamicEnabled) {
            return basePrice;
        }

        long totalBookable = roomRepository.countByRoomTypeIdAndActiveTrue(roomType.getId());
        if (totalBookable == 0) return basePrice;

        long occupiedCount = bookingRepository.countOccupiedRoomsByRoomTypeAndDate(
                roomType.getId(), date,
                List.of(BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN)
        );

        double occupancyPercentage = ((double) occupiedCount / totalBookable) * 100.0;
        List<PricingRule> rules = pricingRuleRepository.findMatchingRules(roomType.getId(), occupancyPercentage);

        if (rules.isEmpty()) {
            // Apply default system thresholds if no explicit rule matches
            if (occupancyPercentage < 30.0) {
                basePrice = basePrice.multiply(BigDecimal.valueOf(0.90)); // 10% discount
            } else if (occupancyPercentage >= 70.0) {
                basePrice = basePrice.multiply(BigDecimal.valueOf(1.15)); // 15% markup
            }
        } else {
            PricingRule rule = rules.get(0);
            basePrice = applyRule(basePrice, rule);
        }

        // Clamp between min and max
        if (roomType.getMinimumPrice() != null && basePrice.compareTo(roomType.getMinimumPrice()) < 0) {
            basePrice = roomType.getMinimumPrice();
        }
        if (roomType.getMaximumPrice() != null && basePrice.compareTo(roomType.getMaximumPrice()) > 0) {
            basePrice = roomType.getMaximumPrice();
        }

        return basePrice.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal applyRule(BigDecimal basePrice, PricingRule rule) {
        BigDecimal value = rule.getAdjustmentValue();
        switch (rule.getAdjustmentType()) {
            case PERCENTAGE_DISCOUNT:
                return basePrice.subtract(basePrice.multiply(value).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
            case PERCENTAGE_MARKUP:
                return basePrice.add(basePrice.multiply(value).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
            case FIXED_DISCOUNT:
                return basePrice.subtract(value).max(BigDecimal.ZERO);
            case FIXED_MARKUP:
                return basePrice.add(value);
            case NO_ADJUSTMENT:
            default:
                return basePrice;
        }
    }

    @Transactional(readOnly = true)
    public List<PricingRuleDto> getAllRules() {
        return pricingRuleRepository.findAll().stream()
                .map(PricingRuleDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public PricingRuleDto createRule(PricingRuleDto dto) {
        RoomType rt = null;
        if (dto.getRoomTypeId() != null) {
            rt = roomTypeRepository.findById(dto.getRoomTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + dto.getRoomTypeId()));
        }

        PricingRule rule = PricingRule.builder()
                .name(dto.getName())
                .roomType(rt)
                .minimumOccupancyPercentage(dto.getMinOccupancyPercentage())
                .maximumOccupancyPercentage(dto.getMaxOccupancyPercentage())
                .adjustmentType(dto.getAdjustmentType() != null ? dto.getAdjustmentType() : PricingAdjustmentType.NO_ADJUSTMENT)
                .adjustmentValue(dto.getAdjustmentValue() != null ? dto.getAdjustmentValue() : BigDecimal.ZERO)
                .minimumPrice(dto.getAllowedMinPrice())
                .maximumPrice(dto.getAllowedMaxPrice())
                .active(true)
                .build();

        rule = pricingRuleRepository.save(rule);
        return PricingRuleDto.fromEntity(rule);
    }

    @Transactional
    public PricingRuleDto updateRule(Long id, PricingRuleDto dto) {
        PricingRule rule = pricingRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing rule not found with ID: " + id));

        if (dto.getName() != null) rule.setName(dto.getName());
        if (dto.getMinOccupancyPercentage() >= 0) rule.setMinimumOccupancyPercentage(dto.getMinOccupancyPercentage());
        if (dto.getMaxOccupancyPercentage() > 0) rule.setMaximumOccupancyPercentage(dto.getMaxOccupancyPercentage());
        if (dto.getAdjustmentType() != null) rule.setAdjustmentType(dto.getAdjustmentType());
        if (dto.getAdjustmentValue() != null) rule.setAdjustmentValue(dto.getAdjustmentValue());
        if (dto.getAllowedMinPrice() != null) rule.setMinimumPrice(dto.getAllowedMinPrice());
        if (dto.getAllowedMaxPrice() != null) rule.setMaximumPrice(dto.getAllowedMaxPrice());

        rule = pricingRuleRepository.save(rule);
        return PricingRuleDto.fromEntity(rule);
    }

    @Transactional
    public boolean toggleDynamicPricing(boolean enabled) {
        HotelSettings settings = hotelSettingsRepository.findById(1L).orElseGet(() ->
                HotelSettings.builder().id(1L).hotelName("SmartStay").build());
        settings.setIsDynamicPricingEnabled(enabled);
        hotelSettingsRepository.save(settings);
        return enabled;
    }

    @Transactional(readOnly = true)
    public PricingPreviewResultDto previewPricing(PricingPreviewRequestDto req) {
        RoomType rt = roomTypeRepository.findById(req.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + req.getRoomTypeId()));

        LocalDate date = LocalDate.parse(req.getTargetDate());
        long totalRooms = roomRepository.countByRoomTypeIdAndActiveTrue(rt.getId());
        long occupied = bookingRepository.countOccupiedRoomsByRoomTypeAndDate(
                rt.getId(), date, List.of(BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN)
        );

        double occupancy = totalRooms > 0 ? ((double) occupied / totalRooms) * 100.0 : 0.0;
        BigDecimal calculated = calculateNightlyPrice(rt, date);

        List<PricingRule> rules = pricingRuleRepository.findMatchingRules(rt.getId(), occupancy);
        String ruleName = !rules.isEmpty() ? rules.get(0).getName() : "Default Occupancy Rule";
        PricingAdjustmentType adjType = !rules.isEmpty() ? rules.get(0).getAdjustmentType() : PricingAdjustmentType.NO_ADJUSTMENT;
        BigDecimal adjVal = !rules.isEmpty() ? rules.get(0).getAdjustmentValue() : BigDecimal.ZERO;

        return PricingPreviewResultDto.builder()
                .roomTypeId(rt.getId())
                .roomTypeName(rt.getName())
                .targetDate(req.getTargetDate())
                .basePrice(rt.getBasePrice())
                .totalRooms(totalRooms)
                .occupiedRooms(occupied)
                .occupancyPercentage(occupancy)
                .appliedRuleName(ruleName)
                .adjustmentType(adjType)
                .adjustmentValue(adjVal)
                .calculatedPrice(calculated)
                .clampedFinalPrice(calculated)
                .currency("INR")
                .build();
    }

    @Transactional
    public RecalculatePricingResultDto recalculatePricing() {
        List<RoomType> types = roomTypeRepository.findByActiveTrue();
        int evaluated = 0;
        int updated = 0;
        LocalDate today = LocalDate.now();

        for (RoomType rt : types) {
            evaluated++;
            BigDecimal calcPrice = calculateNightlyPrice(rt, today);
            PriceSnapshot snapshot = priceSnapshotRepository.findByRoomTypeIdAndTargetDate(rt.getId(), today)
                    .orElseGet(() -> PriceSnapshot.builder().roomType(rt).targetDate(today).build());
            snapshot.setCalculatedPrice(calcPrice);
            snapshot.setOccupancyPercentage(50.0);
            snapshot.setCalculatedAt(LocalDateTime.now());
            priceSnapshotRepository.save(snapshot);
            updated++;
        }

        return RecalculatePricingResultDto.builder()
                .totalRoomsEvaluated(evaluated)
                .pricesUpdated(updated)
                .recalculatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }
}
