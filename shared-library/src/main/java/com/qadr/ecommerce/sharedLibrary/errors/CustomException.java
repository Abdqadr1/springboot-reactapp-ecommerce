package com.qadr.ecommerce.sharedLibrary.errors;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@EqualsAndHashCode(callSuper = true)
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
