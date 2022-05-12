package com.qadr.ecommerceadmin.errors;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException{
    private final HttpStatus status;

    public CustomException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
    public CustomException(HttpStatus status, String message, Throwable throwable){
        super(message, throwable);
        this.status = status;
    }
}
