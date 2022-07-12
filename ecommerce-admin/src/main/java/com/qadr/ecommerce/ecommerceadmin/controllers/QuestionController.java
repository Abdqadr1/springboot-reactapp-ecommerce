package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.QuestionService;
import com.qadr.ecommerce.ecommerceadmin.service.UserService;
import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.entities.review.Review;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/question")
public class QuestionController {
    @Autowired private QuestionService questionService;
    @Autowired private UserService userService;


    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("questions") PagingAndSortingHelper helper){

        return questionService.getPage(number, helper);
    }

    @PostMapping("/edit")
    public Question editQuestion(Question question){
        User user = getUserDetails();
        return questionService.saveQuestion(question, user);
    }


    @GetMapping("/delete/{id}")
    public void deleteQuestion(@PathVariable("id") Integer id){
        questionService.deleteQuestion(id);
    }

    public User getUserDetails(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        return userService.getByEmail(name);
    }

}

