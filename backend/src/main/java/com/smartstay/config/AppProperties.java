package com.smartstay.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Jwt jwt = new Jwt();
    private Hotel hotel = new Hotel();

    public Jwt getJwt() {
        return jwt;
    }

    public void setJwt(Jwt jwt) {
        this.jwt = jwt;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }

    public static class Jwt {
        private String secret;
        private long expirationMinutes = 1440;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public long getExpirationMinutes() {
            return expirationMinutes;
        }

        public void setExpirationMinutes(long expirationMinutes) {
            this.expirationMinutes = expirationMinutes;
        }
    }

    public static class Hotel {
        private double taxPercentage = 12.0;
        private double serviceFeePercentage = 5.0;
        private String checkInTime = "14:00";
        private String checkOutTime = "11:00";
        private int maxStayDays = 30;
        private int pendingPaymentTimeoutMinutes = 15;
        private int cancellationCutoffHours = 24;

        public double getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(double taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

        public double getServiceFeePercentage() {
            return serviceFeePercentage;
        }

        public void setServiceFeePercentage(double serviceFeePercentage) {
            this.serviceFeePercentage = serviceFeePercentage;
        }

        public String getCheckInTime() {
            return checkInTime;
        }

        public void setCheckInTime(String checkInTime) {
            this.checkInTime = checkInTime;
        }

        public String getCheckOutTime() {
            return checkOutTime;
        }

        public void setCheckOutTime(String checkOutTime) {
            this.checkOutTime = checkOutTime;
        }

        public int getMaxStayDays() {
            return maxStayDays;
        }

        public void setMaxStayDays(int maxStayDays) {
            this.maxStayDays = maxStayDays;
        }

        public int getPendingPaymentTimeoutMinutes() {
            return pendingPaymentTimeoutMinutes;
        }

        public void setPendingPaymentTimeoutMinutes(int pendingPaymentTimeoutMinutes) {
            this.pendingPaymentTimeoutMinutes = pendingPaymentTimeoutMinutes;
        }

        public int getCancellationCutoffHours() {
            return cancellationCutoffHours;
        }

        public void setCancellationCutoffHours(int cancellationCutoffHours) {
            this.cancellationCutoffHours = cancellationCutoffHours;
        }
    }
}
