package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.ReviewService;
import com.qadr.ecommerce.sharedLibrary.entities.Review;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping(value = "/review")
public class ReviewController {
    @Autowired private ReviewService reviewService;

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("reviews") PagingAndSortingHelper helper){

        return reviewService.getPage(number, helper);
    }

    @PostMapping("/edit")
    public Review editReview(HttpServletRequest request){
        Integer id = Integer.valueOf(request.getParameter("id"));
        String headline = request.getParameter("headline");
        String comment = request.getParameter("comment");
        return reviewService.saveReview(new Review(id, headline, comment));
    }

    @GetMapping("/delete/{id}")
    public void deleteReview(@PathVariable("id") Integer id){
        reviewService.deleteReview(id);
    }
}
