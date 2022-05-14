package com.qadr.ecommerceadmin.controllers;

import com.qadr.ecommerceadmin.errors.CustomException;
import com.qadr.ecommerceadmin.model.AdminUserDetails;
import com.qadr.ecommerceadmin.model.User;
import com.qadr.ecommerceadmin.repo.UserRepo;
import com.qadr.ecommerceadmin.service.UserService;
import com.qadr.sharedLibrary.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
public class AccountController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/account")
    public User getAccount(@RequestParam("id") Long id){
        User user = userRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "User not found"));
        return user;
    }

    @PostMapping("/account/edit/{id}")
    public User editAccount(User user,
                            @PathVariable("id") Long id,
                            @RequestParam(value = "image", required = false) MultipartFile file) throws IOException {
        if(Optional.ofNullable(file).isPresent()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254):filename;
            user.setPhoto(filename);
            User editedUser = userService.editAccountInfo(id, user);
            String uploadFolder = "user-photos/"+editedUser.getId();
            FileUploadUtil.cleanDir(uploadFolder);
            FileUploadUtil.saveFile(file, uploadFolder, filename);
            return editedUser;
        }
        return userService.editAccountInfo(id, user);
    }


}
