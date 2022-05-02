package com.qadr.ecommerceadmin.service;

import com.qadr.ecommerceadmin.model.User;
import com.qadr.ecommerceadmin.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public List<User> getAllUsers(){
        return userRepo.findAll();
    }
}
