package com.mss301.response;

import com.mss301.common.exception.ApiException;
import com.mss301.common.exception.ErrorCode;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Shared advice translating exceptions into the standard {@link ApiResponse}
 * envelope. Picked up by each web service that component-scans
 * {@code com.mss301.response}.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleApiException(ApiException ex) {
        ErrorCode code = ex.getErrorCode();
        if (code.status().is5xxServerError()) {
            log.error("API exception [{}]: {}", code, ex.getMessage(), ex);
        } else {
            log.warn("API exception [{}]: {}", code, ex.getMessage());
        }
        ErrorResponse error = ErrorResponse.of(code.name(), ex.getMessage());
        return ResponseEntity.status(code.status())
                .body(ApiResponse.error(ex.getMessage(), error));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        ErrorResponse error = ErrorResponse.of(
                ErrorCode.VALIDATION_ERROR.name(),
                ErrorCode.VALIDATION_ERROR.defaultMessage(),
                fieldErrors);
        return ResponseEntity.status(ErrorCode.VALIDATION_ERROR.status())
                .body(ApiResponse.error(ErrorCode.VALIDATION_ERROR.defaultMessage(), error));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleConstraintViolation(ConstraintViolationException ex) {
        ErrorResponse error = ErrorResponse.of(ErrorCode.VALIDATION_ERROR.name(), ex.getMessage());
        return ResponseEntity.status(ErrorCode.VALIDATION_ERROR.status())
                .body(ApiResponse.error(ErrorCode.VALIDATION_ERROR.defaultMessage(), error));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);
        ErrorResponse error = ErrorResponse.of(
                ErrorCode.INTERNAL_ERROR.name(),
                ErrorCode.INTERNAL_ERROR.defaultMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ErrorCode.INTERNAL_ERROR.defaultMessage(), error));
    }
}
