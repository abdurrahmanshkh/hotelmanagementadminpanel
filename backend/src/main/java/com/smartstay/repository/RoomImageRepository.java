package com.smartstay.repository;

import com.smartstay.model.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {
    List<RoomImage> findByRoomTypeId(Long roomTypeId);
    List<RoomImage> findByRoomId(Long roomId);
}
