package com.smartstay.repository;

import com.smartstay.enums.RoomStatus;
import com.smartstay.model.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByPublicId(String publicId);

    Optional<Room> findByRoomNumber(String roomNumber);

    List<Room> findByActiveTrue();

    List<Room> findByFeaturedTrueAndActiveTrue();

    List<Room> findByRoomTypeIdAndActiveTrue(Long roomTypeId);

    List<Room> findByStatusAndActiveTrue(RoomStatus status);

    long countByStatus(RoomStatus status);

    long countByRoomTypeIdAndActiveTrue(Long roomTypeId);

    @Query("SELECT r FROM Room r WHERE r.active = true AND " +
           "(:roomTypeId IS NULL OR r.roomType.id = :roomTypeId) AND " +
           "(:floor IS NULL OR r.floorNumber = :floor) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:minPrice IS NULL OR r.roomType.basePrice >= :minPrice) AND " +
           "(:maxPrice IS NULL OR r.roomType.basePrice <= :maxPrice) AND " +
           "(:adults IS NULL OR r.roomType.maximumAdults >= :adults) AND " +
           "(:bedType IS NULL OR LOWER(r.roomType.bedType) LIKE LOWER(CONCAT('%', :bedType, '%'))) AND " +
           "(:query IS NULL OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Room> searchRooms(
            @Param("query") String query,
            @Param("roomTypeId") Long roomTypeId,
            @Param("floor") Integer floor,
            @Param("status") RoomStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("adults") Integer adults,
            @Param("bedType") String bedType,
            Pageable pageable
    );
}
