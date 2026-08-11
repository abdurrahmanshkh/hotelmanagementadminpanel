package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.pricing.*;
import com.smartstay.service.PricingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/pricing")
public class PricingController {

    private final PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @GetMapping("/rules")
    public ResponseEntity<ApiResponse<List<PricingRuleDto>>> getRules() {
        List<PricingRuleDto> rules = pricingService.getAllRules();
        return ResponseEntity.ok(ApiResponse.ok("Pricing rules retrieved", rules));
    }

    @PostMapping("/rules")
    public ResponseEntity<ApiResponse<PricingRuleDto>> createRule(@RequestBody PricingRuleDto dto) {
        PricingRuleDto created = pricingService.createRule(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Pricing rule created successfully", created));
    }

    @GetMapping("/rules/{id}")
    public ResponseEntity<ApiResponse<PricingRuleDto>> getRuleById(@PathVariable Long id) {
        PricingRuleDto rule = pricingService.getRuleById(id);
        return ResponseEntity.ok(ApiResponse.ok("Pricing rule retrieved", rule));
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<ApiResponse<PricingRuleDto>> updateRule(
            @PathVariable Long id,
            @RequestBody PricingRuleDto dto
    ) {
        PricingRuleDto updated = pricingService.updateRule(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Pricing rule updated successfully", updated));
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRule(@PathVariable Long id) {
        pricingService.deleteRule(id);
        return ResponseEntity.ok(ApiResponse.ok("Pricing rule deleted successfully", null));
    }

    @PatchMapping("/rules/{id}/status")
    public ResponseEntity<ApiResponse<PricingRuleDto>> toggleRuleStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean active = body.getOrDefault("isActive", body.getOrDefault("active", true));
        PricingRuleDto updated = pricingService.toggleRuleStatus(id, active);
        return ResponseEntity.ok(ApiResponse.ok("Pricing rule status updated", updated));
    }

    @PatchMapping("/enabled")
    public ResponseEntity<ApiResponse<Boolean>> toggleDynamicPricing(@RequestBody Map<String, Boolean> body) {
        boolean enabled = body.getOrDefault("enabled", true);
        boolean result = pricingService.toggleDynamicPricing(enabled);
        return ResponseEntity.ok(ApiResponse.ok("Dynamic pricing setting updated", result));
    }

    @PostMapping("/preview")
    public ResponseEntity<ApiResponse<PricingPreviewResultDto>> previewPricing(@RequestBody PricingPreviewRequestDto request) {
        PricingPreviewResultDto result = pricingService.previewPricing(request);
        return ResponseEntity.ok(ApiResponse.ok("Pricing preview generated", result));
    }

    @PostMapping("/recalculate")
    public ResponseEntity<ApiResponse<RecalculatePricingResultDto>> recalculatePricing() {
        RecalculatePricingResultDto result = pricingService.recalculatePricing();
        return ResponseEntity.ok(ApiResponse.ok("Prices recalculated successfully", result));
    }
}
