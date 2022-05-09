package com.qadr.ecommerceadmin.controllers;

import com.qadr.ecommerceadmin.model.User;
import com.qadr.ecommerceadmin.service.UserService;
import com.qadr.sharedLibrary.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", allowCredentials = "false", allowedHeaders = "*")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> listFirstPage(){
        return listUserByPage(1);
    }

    @PostMapping(value = "/add")
    public User addNewUser (User user, @RequestParam(value = "image", required = false) MultipartFile file) throws IOException {
        if(Optional.ofNullable(file).isPresent()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254) : filename;
            user.setPhoto(filename);
            User savedUser = userService.addUser(user);
            String uploadFolder = "user-photos/admin/"+savedUser.getId();
            FileUploadUtil.saveFile(file, uploadFolder, filename);
            return savedUser;
        }
        return userService.addUser(user);
    }

    @PostMapping("/edit/{id}")
    public User addNewUser (User user,@PathVariable("id") Long id,
                            @RequestParam(value = "image", required = false) MultipartFile file) throws IOException {

        if(Optional.ofNullable(file).isPresent()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254):filename;
            user.setPhoto(filename);
            User editedUser = userService.editUser(id, user);
            String uploadFolder = "user-photos/admin/"+editedUser.getId();
            FileUploadUtil.cleanDir(uploadFolder);
            FileUploadUtil.saveFile(file, uploadFolder, filename);
            return editedUser;
        }
        return userService.editUser(id, user);
    }

    @GetMapping("/delete/{id}")
    public User deleteUser(@PathVariable("id") Long id){
        return userService.deleteUser(id);
    }

    @GetMapping("{id}/enable/{status}")
    public String updateEnabledStatus(@PathVariable("id") Long id, @PathVariable("status") boolean status){
        return userService.setEnableStatus(id, status);
    }

    @GetMapping("/page/{number}")
    public List<User> listUserByPage(@PathVariable("number") Integer number){
        Page<User> page = userService.getPage(number);
        int startCount = (number-1) * UserService.USERS_PER_PAGE + 1;
        int endCount = UserService.USERS_PER_PAGE * number;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;

        System.out.println(startCount + " to "+ endCount);
        System.out.println("All users == " + page.getTotalElements());
        System.out.println("All pages == " + page.getTotalPages());
        return page.getContent();
    }

}
