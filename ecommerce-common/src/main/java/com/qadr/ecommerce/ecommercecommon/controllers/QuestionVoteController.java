package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.model.VoteResult;
import com.qadr.ecommerce.ecommercecommon.model.VoteType;
import com.qadr.ecommerce.ecommercecommon.service.QuestionVoteService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/question_vote")
public class QuestionVoteController {
    @Autowired private QuestionVoteService questionVoteService;
    @Autowired private ControllerHelper controllerHelper;

    @PostMapping("/vote/{id}/{type}")
    public VoteResult voteReview(@PathVariable("id") Integer id, @PathVariable("type") String type){
        VoteType voteType = VoteType.valueOf(type.toUpperCase());
        Customer customer = controllerHelper.getCustomerDetails();
        return questionVoteService.doVote(id, customer, voteType);
    }
}
