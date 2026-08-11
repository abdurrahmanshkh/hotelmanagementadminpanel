package com.smartstay.dto.auth;

public class AuthResponseDto {

    private String accessToken;
    private String token;
    private String tokenType;
    private long expiresInSeconds;
    private Object user;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String accessToken, String token, String tokenType, long expiresInSeconds, Object user) {
        this.accessToken = accessToken;
        this.token = token;
        this.tokenType = tokenType;
        this.expiresInSeconds = expiresInSeconds;
        this.user = user;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public long getExpiresInSeconds() { return expiresInSeconds; }
    public void setExpiresInSeconds(long expiresInSeconds) { this.expiresInSeconds = expiresInSeconds; }

    public Object getUser() { return user; }
    public void setUser(Object user) { this.user = user; }

    public static AuthResponseDtoBuilder builder() {
        return new AuthResponseDtoBuilder();
    }

    public static class AuthResponseDtoBuilder {
        private String accessToken;
        private String token;
        private String tokenType;
        private long expiresInSeconds;
        private Object user;

        public AuthResponseDtoBuilder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public AuthResponseDtoBuilder token(String token) { this.token = token; return this; }
        public AuthResponseDtoBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public AuthResponseDtoBuilder expiresInSeconds(long expiresInSeconds) { this.expiresInSeconds = expiresInSeconds; return this; }
        public AuthResponseDtoBuilder user(Object user) { this.user = user; return this; }

        public AuthResponseDto build() {
            return new AuthResponseDto(accessToken, token, tokenType, expiresInSeconds, user);
        }
    }
}
