package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.repo.CustomerRepo;
import com.qadr.ecommerce.sharedLibrary.entities.*;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.CountryRepo;
import com.qadr.ecommerce.sharedLibrary.repo.SettingsRepo;
import com.qadr.ecommerce.sharedLibrary.repo.StateRepo;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepo customerRepo;
    @Autowired
    private CountryRepo countryRepo;
    @Autowired
    private StateRepo stateRepo;
    @Autowired
    private SettingsRepo settingsRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Country> findAllCountries(){
        return countryRepo.findAllByOrderByNameAsc();
    }

    public List<State> findStates(Country country){
        return stateRepo.findByCountryOrderByNameAsc(country);
    }

    public Customer register(Customer customer){
        String code = RandomString.make(64);
        encodePassword(customer);
        customer.setCreatedTime(LocalDateTime.now());
        customer.setVerificationCode(code);
        customer.setEnabled(false);
        Customer save = customerRepo.save(customer);
        return save;
    }

    public EmailSettingBag getEmailSettings(){
        List<Setting> settingList = settingsRepo.
                findByTwoCategories(SettingsCategory.MAIL_SERVER, SettingsCategory.MAIL_TEMPLATE);
        return new EmailSettingBag(settingList);
    }


    void encodePassword(Customer customer){
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
    }

    @Transactional
    public String verifyCustomer(String code) {
        Customer customer = customerRepo.findByVerificationCode(code)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "No user found"));
        if(customer.isEnabled()){
            return "Email already confirmed";
        }
        customerRepo.changeStatus(customer.getId(), true);
        return "You have been verified";
    }
}
