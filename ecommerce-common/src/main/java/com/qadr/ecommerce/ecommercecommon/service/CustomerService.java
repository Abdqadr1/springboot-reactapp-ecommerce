package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.CustomerDetails;
import com.qadr.ecommerce.sharedLibrary.repo.CustomerRepo;
import com.qadr.ecommerce.sharedLibrary.entities.*;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.CountryRepo;
import com.qadr.ecommerce.sharedLibrary.repo.SettingsRepo;
import com.qadr.ecommerce.sharedLibrary.repo.StateRepo;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService implements UserDetailsService {
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
        customer.setAuthenticationType(AuthType.DATABASE);
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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Customer customer = customerRepo.findByEmail(username)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "No user found with email"));
        return new CustomerDetails(customer);
    }

    public Optional<Customer> getByEmail(String email){
        return customerRepo.findByEmail(email);
    }
    public void changeAuthType(Integer id, AuthType type){
        customerRepo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "No user found"));
        customerRepo.changeAuthType(id, type);
    }

    public Customer createCustomerFromOAuth(String name, String email, String countryCode, AuthType authType){
        Customer customer = new Customer();
        setName(name, customer);
        customer.setCreatedTime(LocalDateTime.now());
        customer.setEmail(email);
        customer.setPassword("your password");
        customer.setEnabled(true);
        customer.setPhoneNumber("your number");
        customer.setMainAddress("your main address");
        customer.setPostalCode("your zip code");
        customer.setCity("your city");
        customer.setState("your state");
        customer.setCountry(findCountryByCode(countryCode));
        customer.setAuthenticationType(authType);
        return customerRepo.save(customer);
    }

    public Country findCountryByCode(String code){
        return countryRepo.findByCode(code);
    }

    public void setName(String name, Customer customer){
        String[] names = name.split(" ");
        if(names.length < 2){
            customer.setFirstName(name);
            customer.setLastName("");
        } else {
            String firstName = names[0];
            customer.setFirstName(firstName);
            customer.setLastName(name.replace(firstName+ " ", ""));
        }
    }
}
