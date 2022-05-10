package com.qadr.ecommerceadmin.controllers;

import com.qadr.ecommerceadmin.export.UserCsvExport;
import com.qadr.ecommerceadmin.export.UserExcelExporter;
import com.qadr.ecommerceadmin.model.User;
import com.qadr.ecommerceadmin.service.UserService;
import com.qadr.sharedLibrary.util.FileUploadUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", allowCredentials = "false", allowedHeaders = "*")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public CustomPage listFirstPage() throws IOException {
        return listUserByPage(1, "firstName", "asc", null);
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
    public CustomPage listUserByPage(@PathVariable("number") Integer number,
                                     @RequestParam("sortField") String sortField,
                                     @RequestParam("dir") String dir,
                                     @RequestParam(value = "keyword", required = false)String keyword) throws IOException {
        Page<User> page = userService.getPage(number, sortField, dir, keyword);
        int startCount = (number-1) * UserService.USERS_PER_PAGE + 1;
        int endCount = UserService.USERS_PER_PAGE * number;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;
        Map<String, Integer> pageInfo = new HashMap<>();
        pageInfo.put("startCount", startCount);
        pageInfo.put("endCount", endCount);
        pageInfo.put("totalPages", page.getTotalPages());
        pageInfo.put("totalElement", (int) page.getTotalElements());

        return new CustomPage(
                number, startCount, endCount, page.getTotalPages(), page.getTotalElements(), page.getContent()
        );
    }

    @GetMapping("/export/csv")
    void exportCSV(HttpServletResponse response) throws IOException {
        List<User> users = userService.getAllUsers();
        UserCsvExport userCsvExport = new UserCsvExport();
        userCsvExport.export(users, response);
    }
    @GetMapping("/export/excel")
    void exportExcel(HttpServletResponse response) throws IOException {
        List<User> users = userService.getAllUsers();
        UserExcelExporter userExcelExporter = new UserExcelExporter();
        userExcelExporter.export(users, response);
    }
    @GetMapping("/export/pdf")
    void exportPDF(HttpServletResponse response) throws IOException {
        List<User> users = userService.getAllUsers();
        UserCsvExport userCsvExport = new UserCsvExport();
        userCsvExport.export(users, response);
    }
}

@AllArgsConstructor
@Data
class CustomPage {
    Integer currentPage;
    Integer startCount;
    Integer endCount;
    Integer totalPages;
    Long totalElements;
    List<User> users;

}
