package com.bookstore.exception;

import java.time.LocalDateTime;
import java.util.Map;

public class ApiError {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> errors;

    public ApiError() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final ApiError e = new ApiError();
        public Builder status(int v) { e.status = v; return this; }
        public Builder message(String v) { e.message = v; return this; }
        public Builder timestamp(LocalDateTime v) { e.timestamp = v; return this; }
        public Builder errors(Map<String, String> v) { e.errors = v; return this; }
        public ApiError build() { return e; }
    }

    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public Map<String, String> getErrors() { return errors; }
}
