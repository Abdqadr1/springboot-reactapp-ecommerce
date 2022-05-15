package com.qadr.ecommerce.controllers;

import com.qadr.sharedLibrary.util.CommonUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class HelloController {

    @GetMapping("/appname")
    public String getAppName(){
        return CommonUtil.getAppName();
    }
}
