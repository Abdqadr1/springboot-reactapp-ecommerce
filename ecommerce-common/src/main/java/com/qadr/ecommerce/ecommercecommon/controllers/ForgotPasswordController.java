package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class ForgotPasswordController {
    @Autowired private CustomerService customerService;

    @PostMapping("/forgot-password")
    public String forgotPassword(HttpServletRequest request){
        String email = request.getParameter("email");
        if(email != null || email.isBlank()){
            customerService.forgotPassword(email);
        }else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "Need a email address");
        }
        return  "We have sent a reset password link to your email, Please check";
    }
}
