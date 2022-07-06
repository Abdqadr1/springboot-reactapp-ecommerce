package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.model.VoteResult;
import com.qadr.ecommerce.ecommercecommon.model.VoteType;
import com.qadr.ecommerce.ecommercecommon.service.ReviewVoteService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review_vote")
public class ReviewVoteController {
    @Autowired private ReviewVoteService reviewVoteService;
    @Autowired private ControllerHelper controllerHelper;

    @PostMapping("/vote/{id}/{type}")
    public VoteResult voteReview(@PathVariable("id") Integer id, @PathVariable("type") String type){
        VoteType voteType = VoteType.valueOf(type.toUpperCase());
        Customer customer = controllerHelper.getCustomerDetails();
        return reviewVoteService.doVote(id, customer, voteType);
    }
}
