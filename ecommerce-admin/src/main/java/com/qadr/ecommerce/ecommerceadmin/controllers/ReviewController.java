package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.ReviewService;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/review")
public class ReviewController {
    @Autowired private ReviewService reviewService;

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("reviews") PagingAndSortingHelper helper){

        return reviewService.getPage(number, helper);
    }

}
