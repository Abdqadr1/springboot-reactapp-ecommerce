package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.ecommerceadmin.model.AdminUserDetails;
import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.ecommerceadmin.repo.UserRepo;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.util.AmazonS3Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static com.qadr.ecommerce.sharedLibrary.entities.Constants.USER_IMAGE_FOLDER_NAME;

@Service
@Transactional
public class UserService implements UserDetailsService {

    public static final int USERS_PER_PAGE = 10;

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<User> getAllUsers(){
        return userRepo.findAll(Sort.by("firstName").ascending());
    }

    public User addUser(User user){
        Optional<User> byEmail = userRepo.findByEmail(user.getEmail());
        if (byEmail.isPresent()){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public User editUser(Long id, User user){
        User oldUser = userRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "User id " + id + " not found"));

        Optional<User> byEmail = userRepo.findByEmail(user.getEmail());

        if (byEmail.isPresent() && !Objects.equals(byEmail.get().getId(), id)){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Email already exists");
        }
        if(!user.getPassword().isBlank() && !user.getPassword().equals(oldUser.getPassword())){
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(oldUser.getPassword());
        }
        return userRepo.save(user);
    }

    public User deleteUser(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "user not found!"));
        userRepo.delete(user);
        String uploadFolder = USER_IMAGE_FOLDER_NAME+"/"+id;
        AmazonS3Util.removeFolder(uploadFolder);
        return user;
    }

    public String setEnableStatus(Long id, boolean status){
        userRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "User not found!"));

        userRepo.setUserEnableStatus(id, status);

        return "User status changed";
    }

    public Map<String, Object> getPage(int pageNumber, PagingAndSortingHelper helper){
        return helper.getPageInfo(pageNumber, USERS_PER_PAGE, userRepo);
    }

    public User getByEmail(String email){
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST,
                        "Email does not exist"));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = getByEmail(username);
        return new AdminUserDetails(user);
    }

    public User editAccountInfo(Long id, User user) {
        User oldUser = userRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "User id " + id + " not found"));

        if(!user.getPassword().isBlank() && !user.getPassword().equals(oldUser.getPassword())
                && !passwordEncoder.matches(user.getPassword(), oldUser.getPassword())){
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }else user.setPassword(oldUser.getPassword());
        if(user.getPhoto() == null || user.getPhoto().isBlank())
            user.setPhoto(oldUser.getPhoto());
        user.getRoles().addAll(oldUser.getRoles());
        user.setEnabled(oldUser.isEnabled());
        return userRepo.save(user);
    }
}
