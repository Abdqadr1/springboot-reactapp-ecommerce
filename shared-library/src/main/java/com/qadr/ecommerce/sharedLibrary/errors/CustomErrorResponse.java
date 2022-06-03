package com.qadr.ecommerce.sharedLibrary.errors;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@AllArgsConstructor @Data
public class CustomErrorResponse {
    private String message;
    private HttpStatus status;
    private LocalDateTime now;
}
