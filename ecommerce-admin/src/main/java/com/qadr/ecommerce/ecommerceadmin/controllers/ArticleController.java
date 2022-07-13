package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.ArticleService;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/article")
public class ArticleController {
    @Autowired private ArticleService articleService;
    @Autowired private ControllerHelper controllerHelper;

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("articles") PagingAndSortingHelper helper){

        return articleService.getPage(number, helper);
    }

    @PostMapping("/new")
    public Article addArticle(Article article){
        User user = controllerHelper.getUserDetails();
        return articleService.saveArticle(article, user);
    }

    @PostMapping("/edit")
    public Article updateArticle(Article article){
        User user = controllerHelper.getUserDetails();
        return articleService.updateArticle(article, user);
    }

    @GetMapping("/{id}/enable/{status}")
    public void updateEnabled(@PathVariable("id") Integer id,
                                @PathVariable("status") boolean status){
        articleService.updateStatus(id, status);
    }


    @GetMapping("/delete/{id}")
    public void deleteCategory(@PathVariable("id") Integer id){
        articleService.deleteArticle(id);
    }
}
