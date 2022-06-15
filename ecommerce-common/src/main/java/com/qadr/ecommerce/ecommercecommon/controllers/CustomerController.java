package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.model.CustomerDetails;
import com.qadr.ecommerce.ecommercecommon.repo.CartItemRepo;
import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.sharedLibrary.entities.AuthType;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.qadr.ecommerce.sharedLibrary.util.JWTUtil.createAccessToken;
import static com.qadr.ecommerce.sharedLibrary.util.JWTUtil.createRefreshToken;

@RestController
@RequestMapping(value = "/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;
    @Autowired private CartItemRepo cartItemRepo;
    @Autowired
    private AuthenticationManager authenticationManager;


    @GetMapping("/countries")
    public List<Country> getAllCountries (){
        return customerService.findAllCountries();
    }

    @GetMapping("/states")
    public List<State> getAllCountries (@RequestParam Integer id){
        return customerService.findStates(new Country(id));
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam("email") String email,
                                     @RequestParam("password") String password, HttpServletRequest request){
        try{
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(email, password);
            Authentication auth = authenticationManager.authenticate(authenticationToken);
            CustomerDetails customerDetails = (CustomerDetails) auth.getPrincipal();
            Customer customer = customerDetails.getCustomer();
            customerService.changeAuthType(customer.getId(), AuthType.DATABASE);

            Map<String, Object> tokens = new HashMap<>();
            tokens.put("accessToken", createAccessToken(customerDetails, request.getServletPath()));
            tokens.put("refreshToken", createRefreshToken(customerDetails));
            tokens.put("firstName", customer.getFirstName());
            tokens.put("lastName", customer.getLastName());
            tokens.put("cart", cartItemRepo.findByCustomer(customer).size());
            return tokens;
        } catch (Exception e){
            throw new CustomException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/register")
    public void registerCustomer (@Valid Customer customer, HttpServletRequest request) {
        customerService.register(request,customer);
    }

    @GetMapping("/verify")
    public String verifyCustomer(@RequestParam("code") String code){
        return customerService.verifyCustomer(code);
    }


    @GetMapping("/details")
    public Customer getCustomerDetails(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = customerService.getByEmail(email)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "No user found with email " + email));
        customer.setPassword("");
        return customer;
    }

    @PostMapping("/update-customer")
    public String UpdateCustomerDetails(@Valid Customer customer, HttpServletRequest request){

        customerService.editCustomer(customer);
        return "Your details have been updated";
    }


}
