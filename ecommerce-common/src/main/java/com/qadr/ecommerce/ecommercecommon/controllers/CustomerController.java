package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.ecommercecommon.utilities.Util;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.EmailSettingBag;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping(value = "/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping("/countries")
    public List<Country> getAllCountries (){
        return customerService.findAllCountries();
    }

    @GetMapping("/states")
    public List<State> getAllCountries (@RequestParam Integer id){
        return customerService.findStates(new Country(id));
    }

    @PostMapping("/register")
    public void registerCustomer (@Valid Customer customer, HttpServletRequest request) throws UnsupportedEncodingException {
        Customer savedCustomer =   customerService.register(customer);
        sendVerificationEmail(request, savedCustomer);
    }

    @GetMapping("/verify")
    public String verifyCustomer(@RequestParam("code") String code){
        return customerService.verifyCustomer(code);
    }

    void sendVerificationEmail(HttpServletRequest request, Customer customer) {
        EmailSettingBag emailSettings = customerService.getEmailSettings();
        JavaMailSenderImpl javaMailSender = Util.prepareMailSender(emailSettings);
        String toAddress = customer.getEmail();
        String fullName = customer.getFullName();
        String code = customer.getVerificationCode();
        String url = Util.getSiteURL(request) + "/customer/verify?code="+code;
        String subject = emailSettings.getVerifySubject();
        String content  = emailSettings.getVerifyContent();
        content = content.replace("{{NAME}}", fullName);
        content = content.replace("{{URL}}", url);

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
        try {
            helper.setFrom(emailSettings.getMailFrom(), emailSettings.getMailSenderName());
            helper.setTo(toAddress);
            helper.setSubject(subject);
            helper.setText(content, true);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        javaMailSender.send(mimeMessage);

        System.out.println("to Address = " +toAddress);
        System.out.println("verify url = " + url);
    }

}
