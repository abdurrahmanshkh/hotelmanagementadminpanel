package com.smartstay.repository;

import com.smartstay.model.PricingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PricingRuleRepository extends JpaRepository<PricingRule, Long> {

    List<PricingRule> findByActiveTrue();

    List<PricingRule> findByRoomTypeIdAndActiveTrue(Long roomTypeId);

    @Query("SELECT r FROM PricingRule r WHERE r.active = true AND " +
           "(r.roomType.id = :roomTypeId OR r.roomType IS NULL) AND " +
           ":occupancy >= r.minimumOccupancyPercentage AND :occupancy <= r.maximumOccupancyPercentage " +
           "ORDER BY r.roomType.id DESC")
    List<PricingRule> findMatchingRules(@Param("roomTypeId") Long roomTypeId, @Param("occupancy") Double occupancy);
}
