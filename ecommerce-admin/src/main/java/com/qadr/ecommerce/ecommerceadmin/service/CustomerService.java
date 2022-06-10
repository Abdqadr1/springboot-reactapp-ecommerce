package com.qadr.ecommerce.ecommerceadmin.service;

import antlr.BaseAST;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.CountryRepo;
import com.qadr.ecommerce.sharedLibrary.repo.CustomerRepo;
import com.qadr.ecommerce.sharedLibrary.repo.StateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class CustomerService {
    public static final int CUSTOMERS_PER_PAGE = 10;
    @Autowired private CustomerRepo repo;

    @Autowired private CountryRepo countryRepo;
    @Autowired private StateRepo stateRepo;
    @Autowired private BCryptPasswordEncoder passwordEncoder;


    public String updateStatus(Integer id, boolean status) {
        repo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "No customer found with the id"));
        repo.changeStatus(id, status);

        return "Customer status updated";
    }

    public Page<Customer> getPage(int pageNumber,String field,  String dir, String keyword){
        Sort sort = Sort.by(field);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        PageRequest pageable = PageRequest.of(pageNumber - 1, CUSTOMERS_PER_PAGE, sort);
        if(keyword != null && !keyword.isBlank()){
            return repo.searchKeyword(keyword, pageable);
        }

        return repo.findAll(pageable);
    }

    public List<Customer> getAll() {
        return repo.findAll(Sort.by("firstName").ascending());
    }

    public Customer deleteCustomer(Integer id) {
        Customer customer = repo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "No customer found with the id"));
        repo.deleteById(id);
        return customer;
    }

    public Customer editCustomer(Integer id, Customer customer) {
        Customer oldCustomer = repo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "No customer found with the id"));
        if(!customer.getEmail().equals(oldCustomer.getEmail())){
            Optional<Customer> byEmail = repo.findByEmail(customer.getEmail());
            if(byEmail.isPresent() && !Objects.equals(byEmail.get().getId(), oldCustomer.getId())){
                throw new CustomException(HttpStatus.BAD_REQUEST, "There is a customer with the email "+customer.getEmail());
            }
        }
        if(!customer.getPassword().isBlank()){
            customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        }else{
            customer.setPassword(oldCustomer.getPassword());
        }
        customer.setId(id);
        customer.setCreatedTime(oldCustomer.getCreatedTime());
        customer.setVerificationCode(oldCustomer.getVerificationCode());
        return repo.save(customer);
    }

    public List<Country> getAllCountries(){
        return countryRepo.findAllByOrderByNameAsc();
    }
    public List<State> getCountryStates(Country country){
        return stateRepo.findByCountryOrderByNameAsc(country);
    }
}
