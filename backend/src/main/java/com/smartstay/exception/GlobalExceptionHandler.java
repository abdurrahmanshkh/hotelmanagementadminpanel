package com.smartstay.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public static class ApiError {
        private boolean success;
        private String code;
        private String message;
        private Map<String, String> fieldErrors;
        private String path;
        private String timestamp;
        private String traceId;

        public ApiError() {
        }

        public ApiError(boolean success, String code, String message, Map<String, String> fieldErrors, String path, String timestamp, String traceId) {
            this.success = success;
            this.code = code;
            this.message = message;
            this.fieldErrors = fieldErrors;
            this.path = path;
            this.timestamp = timestamp;
            this.traceId = traceId;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Map<String, String> getFieldErrors() {
            return fieldErrors;
        }

        public void setFieldErrors(Map<String, String> fieldErrors) {
            this.fieldErrors = fieldErrors;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }

        public String getTraceId() {
            return traceId;
        }

        public void setTraceId(String traceId) {
            this.traceId = traceId;
        }

        public static ApiErrorBuilder builder() {
            return new ApiErrorBuilder();
        }

        public static class ApiErrorBuilder {
            private boolean success;
            private String code;
            private String message;
            private Map<String, String> fieldErrors;
            private String path;
            private String timestamp;
            private String traceId;

            public ApiErrorBuilder success(boolean success) {
                this.success = success;
                return this;
            }

            public ApiErrorBuilder code(String code) {
                this.code = code;
                return this;
            }

            public ApiErrorBuilder message(String message) {
                this.message = message;
                return this;
            }

            public ApiErrorBuilder fieldErrors(Map<String, String> fieldErrors) {
                this.fieldErrors = fieldErrors;
                return this;
            }

            public ApiErrorBuilder path(String path) {
                this.path = path;
                return this;
            }

            public ApiErrorBuilder timestamp(String timestamp) {
                this.timestamp = timestamp;
                return this;
            }

            public ApiErrorBuilder traceId(String traceId) {
                this.traceId = traceId;
                return this;
            }

            public ApiError build() {
                return new ApiError(success, code, message, fieldErrors, path, timestamp, traceId);
            }
        }
    }

    private ApiError buildError(String code, String message, Map<String, String> fieldErrors, HttpServletRequest request) {
        return ApiError.builder()
                .success(false)
                .code(code)
                .message(message)
                .fieldErrors(fieldErrors)
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
                .traceId(UUID.randomUUID().toString().substring(0, 8))
                .build();
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(buildError("RESOURCE_NOT_FOUND", ex.getMessage(), null, request));
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ApiError> handleBusinessRule(BusinessRuleException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(buildError("BUSINESS_RULE_VIOLATION", ex.getMessage(), null, request));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError> handleConflict(ConflictException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(buildError("RESOURCE_CONFLICT", ex.getMessage(), null, request));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiError> handleUnauthorized(UnauthorizedException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(buildError("UNAUTHORIZED", ex.getMessage(), null, request));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(buildError("INVALID_CREDENTIALS", "Invalid email, password, or staff code", null, request));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(buildError("FORBIDDEN", "You do not have permission to access this resource", null, request));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(buildError("VALIDATION_FAILED", "Invalid request parameters", errors, request));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError("INTERNAL_SERVER_ERROR", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred", null, request));
    }
}
