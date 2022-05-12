package com.qadr.ecommerceadmin.errors;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class CustomErrorHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CustomErrorResponse> customExceptionHandler(CustomException exception){
        HttpStatus status = exception.getStatus();
        CustomErrorResponse response = new CustomErrorResponse(
                exception.getMessage(),
                status,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, status);
    }

    @AllArgsConstructor @Data
    public class CustomErrorResponse {
        private String message;
        private HttpStatus status;
        private LocalDateTime now;
    }
}


