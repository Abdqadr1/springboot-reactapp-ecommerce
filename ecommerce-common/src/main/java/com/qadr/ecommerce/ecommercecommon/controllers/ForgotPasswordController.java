package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class ForgotPasswordController {
    @Autowired private CustomerService customerService;

    @PostMapping("/forgot-password")
    public String forgotPassword(HttpServletRequest request){
        String email = request.getParameter("email");
        if(email != null && !email.isBlank()){
            return customerService.forgotPassword(request, email);
        }else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "Need a email address");
        }
    }

    @PostMapping("/reset-password/{token}")
    public String resetPassword(@PathVariable("token") String token,  HttpServletRequest request){
        String password = request.getParameter("password");
        String re_password = request.getParameter("re_password");
        if(password != null && !password.isBlank() && password.equals(re_password)){
            return customerService.resetPassword(token, password);
        }else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "Need a password");
        }
    }
}
