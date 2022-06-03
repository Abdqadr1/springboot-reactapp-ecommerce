package com.qadr.ecommerceadmin.service;

import com.qadr.ecommerceadmin.errors.CustomException;
import com.qadr.ecommerceadmin.model.AdminUserDetails;
import com.qadr.ecommerceadmin.model.User;
import com.qadr.ecommerceadmin.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    public static final int USERS_PER_PAGE = 4;

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
        return user;
    }

    public String setEnableStatus(Long id, boolean status){
        userRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "User not found!"));

        userRepo.setUserEnableStatus(id, status);

        return "User status changed";
    }

    public Page<User> getPage(int pageNumber, String field, String dir, String keyword){
        Sort sort = Sort.by(field);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(pageNumber - 1, USERS_PER_PAGE, sort);

        if(keyword != null && !keyword.isBlank()){
            return userRepo.searchKeyword(keyword, pageable);
        }

        return userRepo.findAll(pageable);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(username)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST,
                        String.format("Email does not exist")));

        return new AdminUserDetails(user);
    }

    public User editAccountInfo(Long id, User user) {
        User oldUser = userRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "User id " + id + " not found"));
        if(!user.getPassword().isBlank() && !user.getPassword().equals(oldUser.getPassword())
                && !passwordEncoder.matches(user.getPassword(), oldUser.getPassword())){
            oldUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        oldUser.setFirstName(user.getFirstName());
        oldUser.setLastName(user.getLastName());
        return userRepo.save(oldUser);
    }
}