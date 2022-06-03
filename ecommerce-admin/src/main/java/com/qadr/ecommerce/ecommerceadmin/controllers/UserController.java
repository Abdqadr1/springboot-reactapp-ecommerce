package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.ecommerceadmin.export.UserCsvExport;
import com.qadr.ecommerce.ecommerceadmin.export.UserExcelExporter;
import com.qadr.ecommerce.ecommerceadmin.export.UserPdfExport;
import com.qadr.ecommerce.ecommerceadmin.model.AdminUserDetails;
import com.qadr.ecommerce.ecommerceadmin.model.User;
import com.qadr.ecommerce.ecommerceadmin.service.UserService;
import com.qadr.sharedLibrary.util.FileUploadUtil;
import com.qadr.sharedLibrary.util.JWTUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/user")
    public CustomUserPage listFirstPage() throws IOException {
        return listUserByPage(1, "firstName", "asc", null);
    }

    @PostMapping(value = "/user/add")
    public User addNewUser (User user, @RequestParam(value = "image", required = false) MultipartFile file) throws IOException {
        if(Optional.ofNullable(file).isPresent()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254) : filename;
            user.setPhoto(filename);
            User savedUser = userService.addUser(user);
            String uploadFolder = "user-photos/"+savedUser.getId();
            FileUploadUtil.saveFile(file, uploadFolder, filename);
            return savedUser;
        }
        return userService.addUser(user);
    }

    @PostMapping("/user/edit/{id}")
    public User addNewUser (User user,@PathVariable("id") Long id,
                            @RequestParam(value = "image", required = false) MultipartFile file) throws IOException {

        if(Optional.ofNullable(file).isPresent()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254):filename;
            user.setPhoto(filename);
            User editedUser = userService.editUser(id, user);
            String uploadFolder = "user-photos/"+editedUser.getId();
            FileUploadUtil.cleanDir(uploadFolder);
            FileUploadUtil.saveFile(file, uploadFolder, filename);
            return editedUser;
        }
        return userService.editUser(id, user);
    }

    @GetMapping("/user/delete/{id}")
    public User deleteUser(@PathVariable("id") Long id){
        return userService.deleteUser(id);
    }

    @GetMapping("/user/{id}/enable/{status}")
    public String updateEnabledStatus(@PathVariable("id") Long id, @PathVariable("status") boolean status){
        return userService.setEnableStatus(id, status);
    }

    @GetMapping("/user/page/{number}")
    public CustomUserPage listUserByPage(@PathVariable("number") Integer number,
                                         @RequestParam("sortField") String sortField,
                                         @RequestParam("dir") String dir,
                                         @RequestParam(value = "keyword", required = false) String keyword){
        Page<User> page = userService.getPage(number, sortField, dir, keyword);
        int startCount = (number-1) * UserService.USERS_PER_PAGE + 1;
        int endCount = UserService.USERS_PER_PAGE * number;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;

        return new CustomUserPage(
                number, startCount, endCount, page.getTotalPages(),
                page.getTotalElements(), page.getContent(), UserService.USERS_PER_PAGE
        );
    }

    @GetMapping("/user/export/csv")
    void exportCSV(HttpServletResponse response) throws IOException {
        List<User> users = userService.getAllUsers();
        UserCsvExport userCsvExport = new UserCsvExport();
        userCsvExport.export(users, response);
    }
    @GetMapping("/user/export/excel")
    void exportExcel(HttpServletResponse response) throws IOException {
        List<User> users = userService.getAllUsers();
        UserExcelExporter userExcelExporter = new UserExcelExporter();
        userExcelExporter.export(users, response);
    }
    @GetMapping("/user/export/pdf")
    void exportPDF(HttpServletResponse response) throws IOException {
        List<User> users = userService.getAllUsers();
        UserPdfExport userPdfExport = new UserPdfExport();
        userPdfExport.export(users, response);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam("email") String email,
                        @RequestParam("password") String password, HttpServletRequest request){

        try{
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(email, password);
            Authentication auth = authenticationManager.authenticate(authenticationToken);
            AdminUserDetails userDetails = (AdminUserDetails) auth.getPrincipal();
            User user = userDetails.getUser();
            Map<String, Object> tokens = new HashMap<>();
            tokens.put("accessToken", JWTUtil.createAccessToken(userDetails, request.getServletPath()));
            tokens.put("refreshToken", JWTUtil.createRefreshToken(userDetails));
            tokens.put("firstName", user.getFirstName());
            tokens.put("lastName", user.getLastName());
            tokens.put("id", user.getId());
            tokens.put("roles", user.getRoles());
            return tokens;
        } catch (Exception e){
            throw new CustomException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

}

@AllArgsConstructor
@Data
class CustomUserPage {
    Integer currentPage;
    Integer startCount;
    Integer endCount;
    Integer totalPages;
    Long totalElements;
    List<User> users;
    Integer numberPerPage;
}
