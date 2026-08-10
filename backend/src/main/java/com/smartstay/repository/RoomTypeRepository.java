package com.smartstay.repository;

import com.smartstay.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    Optional<RoomType> findByCode(String code);
    List<RoomType> findByActiveTrue();
}
