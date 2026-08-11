package com.smartstay.dto.room;

import java.math.BigDecimal;

public class RoomAvailabilityResultDto {
    private RoomDto room;
    private boolean available;
    private BigDecimal nightlyPrice;
    private BigDecimal totalPriceForStay;

    public RoomAvailabilityResultDto() {
    }

    public RoomAvailabilityResultDto(RoomDto room, boolean available, BigDecimal nightlyPrice, BigDecimal totalPriceForStay) {
        this.room = room;
        this.available = available;
        this.nightlyPrice = nightlyPrice;
        this.totalPriceForStay = totalPriceForStay;
    }

    public RoomDto getRoom() { return room; }
    public void setRoom(RoomDto room) { this.room = room; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public BigDecimal getNightlyPrice() { return nightlyPrice; }
    public void setNightlyPrice(BigDecimal nightlyPrice) { this.nightlyPrice = nightlyPrice; }

    public BigDecimal getTotalPriceForStay() { return totalPriceForStay; }
    public void setTotalPriceForStay(BigDecimal totalPriceForStay) { this.totalPriceForStay = totalPriceForStay; }

    public static RoomAvailabilityResultDtoBuilder builder() {
        return new RoomAvailabilityResultDtoBuilder();
    }

    public static class RoomAvailabilityResultDtoBuilder {
        private RoomDto room;
        private boolean available;
        private BigDecimal nightlyPrice;
        private BigDecimal totalPriceForStay;

        public RoomAvailabilityResultDtoBuilder room(RoomDto room) { this.room = room; return this; }
        public RoomAvailabilityResultDtoBuilder available(boolean available) { this.available = available; return this; }
        public RoomAvailabilityResultDtoBuilder nightlyPrice(BigDecimal nightlyPrice) { this.nightlyPrice = nightlyPrice; return this; }
        public RoomAvailabilityResultDtoBuilder totalPriceForStay(BigDecimal totalPriceForStay) { this.totalPriceForStay = totalPriceForStay; return this; }

        public RoomAvailabilityResultDto build() {
            return new RoomAvailabilityResultDto(room, available, nightlyPrice, totalPriceForStay);
        }
    }
}
