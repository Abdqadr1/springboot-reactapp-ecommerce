package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.StorefrontService;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.Storefront;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/storefront")
public class StorefrontController {
    @Autowired private StorefrontService storefrontService;

    @GetMapping
    public List<Storefront> getAll(){
        return storefrontService.getAllEnabled();
    }
}
