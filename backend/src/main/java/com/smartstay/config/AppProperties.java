package com.smartstay.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    private Jwt jwt = new Jwt();
    private Hotel hotel = new Hotel();

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long expirationMinutes = 1440;
    }

    @Getter
    @Setter
    public static class Hotel {
        private double taxPercentage = 12.0;
        private double serviceFeePercentage = 5.0;
        private String checkInTime = "14:00";
        private String checkOutTime = "11:00";
        private int maxStayDays = 30;
        private int pendingPaymentTimeoutMinutes = 15;
        private int cancellationCutoffHours = 24;
    }
}
