package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.QuestionService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/question")
public class QuestionController {
    @Autowired private QuestionService questionService;
    @Autowired private ControllerHelper controllerHelper;

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("questions") PagingAndSortingHelper helper){

        Customer customer = controllerHelper.getCustomerDetails();
        return questionService.getPage(number, customer, helper);
    }
    @PostMapping("/save")
    public void postReview(Question question){
        Customer customer = controllerHelper.getCustomerDetails();
        question.setAsker(customer);
        questionService.saveQuestion(question);
    }


}
