package com.qadr.ecommerceadmin.errors;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException{
    private final HttpStatus status;

    public CustomException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
    public CustomException(String message, HttpStatus status, Throwable throwable){
        super(message, throwable);
        this.status = status;
    }
}
