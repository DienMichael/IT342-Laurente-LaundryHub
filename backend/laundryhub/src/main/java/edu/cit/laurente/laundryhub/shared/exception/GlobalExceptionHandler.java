package edu.cit.laurente.laundryhub.shared.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import edu.cit.laurente.laundryhub.features.auth.AuthResponse;
import edu.cit.laurente.laundryhub.shared.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        StringBuilder errorMessage = new StringBuilder();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String msg = error.getDefaultMessage();
            errors.put(fieldName, msg);
            if (errorMessage.length() > 0) {
                errorMessage.append("; ");
            }
            errorMessage.append(fieldName).append(": ").append(msg);
        });

        System.err.println("Validation error for " + request.getRequestURI() + ": " + errorMessage);

        // For auth endpoints, return AuthResponse; for others, return ApiResponse
        if (request.getRequestURI().contains("/auth/")) {
            AuthResponse authResponse = new AuthResponse(false, null, null, null, null, errorMessage.toString());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(authResponse);
        }

        ApiResponse<?> apiResponse = ApiResponse.error("VALID-001", "Validation failed", errors);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(apiResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        System.err.println("Runtime exception for " + request.getRequestURI() + ": " + ex.getMessage());
        ex.printStackTrace();

        // For auth endpoints, return AuthResponse; for others, return ApiResponse
        if (request.getRequestURI().contains("/auth/")) {
            AuthResponse authResponse = new AuthResponse(false, null, null, null, null, ex.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(authResponse);
        }

        ApiResponse<?> apiResponse = ApiResponse.error("ERROR-001", ex.getMessage(), null);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(apiResponse);
    }
}