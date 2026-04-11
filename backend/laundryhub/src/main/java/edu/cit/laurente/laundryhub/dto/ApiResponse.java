package edu.cit.laurente.laundryhub.dto;

import java.time.LocalDateTime;

public class ApiResponse<T> {
    private boolean success;
    private T data;
    private ErrorDetails error;
    private String timestamp;

    public ApiResponse() {}

    public ApiResponse(boolean success, T data, ErrorDetails error, String timestamp) {
        this.success = success;
        this.data = data;
        this.error = error;
        this.timestamp = timestamp;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null, LocalDateTime.now().toString());
    }

    public static <T> ApiResponse<T> error(String code, String message, Object details) {
        ErrorDetails errorDetails = new ErrorDetails(code, message, details);
        return new ApiResponse<>(false, null, errorDetails, LocalDateTime.now().toString());
    }

    public static class ErrorDetails {
        private String code;
        private String message;
        private Object details;

        public ErrorDetails() {}

        public ErrorDetails(String code, String message, Object details) {
            this.code = code;
            this.message = message;
            this.details = details;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Object getDetails() { return details; }
        public void setDetails(Object details) { this.details = details; }
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public ErrorDetails getError() { return error; }
    public void setError(ErrorDetails error) { this.error = error; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}