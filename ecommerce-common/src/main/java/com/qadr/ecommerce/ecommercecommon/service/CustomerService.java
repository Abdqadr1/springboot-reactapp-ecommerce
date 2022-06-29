package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.CustomerDetails;
import com.qadr.ecommerce.ecommercecommon.utilities.Util;
import com.qadr.ecommerce.sharedLibrary.entities.setting.EmailSettingBag;
import com.qadr.ecommerce.sharedLibrary.entities.setting.Setting;
import com.qadr.ecommerce.sharedLibrary.entities.setting.SettingsCategory;
import com.qadr.ecommerce.sharedLibrary.repo.CustomerRepo;
import com.qadr.ecommerce.sharedLibrary.entities.*;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.CountryRepo;
import com.qadr.ecommerce.sharedLibrary.repo.SettingsRepo;
import com.qadr.ecommerce.sharedLibrary.repo.StateRepo;
import net.bytebuddy.utility.RandomString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService implements UserDetailsService {
    public static final Logger LOGGER = LoggerFactory.getLogger(CustomerService.class);
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

    @Transactional
    public Customer register(HttpServletRequest request,Customer customer){
        String code = RandomString.make(64);
        encodePassword(customer);
        customer.setCreatedTime(LocalDateTime.now());
        customer.setVerificationCode(code);
        customer.setEnabled(false);
        customer.setAuthenticationType(AuthType.DATABASE);
        Customer save = customerRepo.save(customer);
        sendVerificationEmail(request, save);
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

    public void editCustomer(Customer customer) {
        if(customer.getId() != null){
            Customer oldCustomer = customerRepo.findById(customer.getId())
                    .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "No user found with id"));
            customer.setEmail(oldCustomer.getEmail());
            customer.setAuthenticationType(oldCustomer.getAuthenticationType());
            customer.setVerificationCode(oldCustomer.getVerificationCode());
            customer.setEnabled(oldCustomer.isEnabled());
            customer.setCreatedTime(oldCustomer.getCreatedTime());
            customer.setResetToken(oldCustomer.getResetToken());

            AuthType authType = oldCustomer.getAuthenticationType();
            if(authType.equals(AuthType.DATABASE) && !customer.getPassword().isBlank()){
                encodePassword(customer);
            }else {
                customer.setPassword(oldCustomer.getPassword());
            }

            customerRepo.save(customer);
        }else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "No user id found");
        }
    }

    @Transactional
    public String forgotPassword(HttpServletRequest request, String email) {
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Email does not exist"));
        String token = RandomString.make(30);
        customer.setResetToken(token);
        return sendForgotPasswordEmail(request, email, token);
    }

    @Transactional
    public String resetPassword(String token, String password) {
        Customer customer = customerRepo.findByResetToken(token)
                .orElseThrow(()->new CustomException(HttpStatus.BAD_REQUEST, "Invalid Token"));
        customer.setPassword(password);
        encodePassword(customer);
        customer.setResetToken(null);
        return "Your password has been reset";
    }


    public String sendForgotPasswordEmail(HttpServletRequest request, String email, String token) {
        try {
            EmailSettingBag emailSettings = getEmailSettings();
            String redirectUrl = request.getParameter("redirect_uri");
            String url = redirectUrl != null ? redirectUrl : Util.getSiteURL(request);
            url = url + "/reset_password?token="+token;
            String content = "<p>Hello,</p>" +
                    "<p>You have requested to reset your password.</p>" +
                    "<p>Click the link below to change your password.</p><br/>" +
                    "<h4><a href=\""+url+"\">Change your password</a></h4><br/>" +
                    "<p>Ignore this email if you do remember your password, or you have not made this request.</p>";

            String subject = "Here's the link to reset your password";
            Util.sendEmail(emailSettings, email, subject, content);
            return  "We have sent a reset password link to your email, Please check";

        } catch (Exception e) {
            LOGGER.info(e.getMessage());
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not send mail, Try again later");
        }

    }

    public void sendVerificationEmail(HttpServletRequest request, Customer customer) {
        try {
            EmailSettingBag emailSettings = getEmailSettings();
            String toAddress = customer.getEmail();
            String fullName = customer.getFullName();
            String code = customer.getVerificationCode();
            String url = Util.getSiteURL(request) + "/customer/verify?code="+code;
            String subject = emailSettings.getVerifySubject();
            String content  = emailSettings.getVerifyContent();
            content = content.replace("{{NAME}}", fullName);
            content = content.replace("{{URL}}", url);
            Util.sendEmail(emailSettings, toAddress, subject, content);

        } catch (Exception e) {
            LOGGER.info(e.getMessage());
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not send mail");
        }

    }

}
