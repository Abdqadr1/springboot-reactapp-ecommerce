package com.qadr.ecommerce.ecommerceadmin.errors;

import com.qadr.ecommerce.sharedLibrary.errors.CustomErrorResponse;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.mail.MessagingException;
import java.time.LocalDateTime;


@ControllerAdvice
public class CustomErrorHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CustomErrorResponse> customException(CustomException customException){
        HttpStatus status = customException.getStatus();
        CustomErrorResponse response = new CustomErrorResponse(
                customException.getMessage(),
                status,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, status);
    }
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers, HttpStatus status, WebRequest request) {
        return sendErrors(ex, status);
    }

    @Override
    protected ResponseEntity<Object> handleBindException(BindException ex, HttpHeaders headers,
                                                         HttpStatus status, WebRequest request) {
        return sendErrors(ex, status);
    }

    public ResponseEntity<Object> handleMessagingException(MessagingException ex){
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        CustomErrorResponse response = new CustomErrorResponse(
                ex.getMessage(),
                status,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, status);
    }


    private ResponseEntity<Object> sendErrors(BindException ex, HttpStatus status){
        StringBuilder errorMessage = new StringBuilder("");
        ex.getBindingResult().getAllErrors().forEach(error -> {
            errorMessage.append(error.getDefaultMessage().concat(". "));
        });
        CustomErrorResponse response = new CustomErrorResponse(
                errorMessage.toString(),
                status,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}


