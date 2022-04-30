package com.qadr.ecommerceadmin.controllers;

import com.qadr.sharedLibrary.util.CommonUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/")
@RestController
public class HelloController {

    @GetMapping("/appname")
    public String getAppName(){
        return CommonUtil.getAppName() + " Admin";
    }

}
