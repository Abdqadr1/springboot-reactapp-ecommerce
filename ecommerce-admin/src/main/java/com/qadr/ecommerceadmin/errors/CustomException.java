package com.qadr.ecommerceadmin.errors;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Data @Getter @Setter
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
