package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.ecommercecommon.service.OrderService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderTrack;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired private OrderService orderService;
    @Autowired private CustomerService customerService;

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("orders") PagingAndSortingHelper helper){
        Customer customer = getCustomerDetails();
        return orderService.getPage(number, customer, helper);
    }

    @PostMapping("/request_return/{id}")
    public OrderTrack requestReturn(@PathVariable("id") Integer id, HttpServletRequest request){
        String reason = request.getParameter("reason");
        String note = request.getParameter("note");
        if(reason == null || reason.isBlank())
            throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid parameters");
        Customer customer = getCustomerDetails();
        return orderService.requestReturn(customer, id, reason, note);
    }

    public Customer getCustomerDetails(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return customerService.getByEmail(email)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "No user found with email " + email));
    }
}
