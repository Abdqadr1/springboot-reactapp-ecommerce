package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.CategoryService;
import com.qadr.ecommerce.ecommercecommon.service.MainService;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
@RestController
public class MainController {
    @Autowired
    private CategoryService categoryService;


    @GetMapping("/c")
    public List<Category> getCategories(){
        return categoryService.getCategories();
    }

    @GetMapping("/c/{alias}")
    public Category listCategoryProduct(@PathVariable("alias") String alias){
        return categoryService.getCategory(alias);
    }
}
