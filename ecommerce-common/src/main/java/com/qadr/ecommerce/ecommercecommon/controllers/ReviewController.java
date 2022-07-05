package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.ecommercecommon.service.ReviewService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Review;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/review")
public class ReviewController {
    @Autowired private ReviewService reviewService;
    @Autowired private CustomerService customerService;
    @Autowired private ControllerHelper controllerHelper;

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("reviews") PagingAndSortingHelper helper){

        Customer customer = controllerHelper.getCustomerDetails();
        return reviewService.getPage(number, customer, helper);
    }

    @PostMapping("/save")
    public void postReview(Review review){
        Customer customer = controllerHelper.getCustomerDetails();
        review.setCustomer(customer);
        reviewService.saveReview(review);
    }

    @GetMapping("/{id}")
    public Review getReview(@PathVariable Integer id){
        Customer customer = controllerHelper.getCustomerDetails();
        return reviewService.getByCustomerAndId(id, customer);
    }


}
