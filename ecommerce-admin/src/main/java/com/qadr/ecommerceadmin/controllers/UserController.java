package com.qadr.ecommerceadmin.controllers;

import com.qadr.ecommerceadmin.model.User;
import com.qadr.ecommerceadmin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @PostMapping("/add")
    public User addNewUser (@RequestBody User user){
        return userService.addUser(user);
    }


}
