package com.bookstore.dto;

public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private UserDto user;

    public AuthResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AuthResponse r = new AuthResponse();
        public Builder accessToken(String v) { r.accessToken = v; return this; }
        public Builder user(UserDto v) { r.user = v; return this; }
        public AuthResponse build() { return r; }
    }

    public String getAccessToken() { return accessToken; }
    public String getTokenType() { return tokenType; }
    public UserDto getUser() { return user; }
}
