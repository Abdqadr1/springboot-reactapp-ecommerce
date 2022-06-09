package com.qadr.ecommerce.ecommercecommon.utilities;

import com.qadr.ecommerce.sharedLibrary.entities.EmailSettingBag;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import javax.servlet.http.HttpServletRequest;
import java.util.Properties;

public class Util {

    public static String getSiteURL(HttpServletRequest request){
        String siteURL = request.getRequestURL().toString();
        siteURL = siteURL.replace(request.getServletPath(), "");
        return siteURL;
    }


    public static JavaMailSenderImpl prepareMailSender(EmailSettingBag settingBag){
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setHost(settingBag.getMailHost());
        javaMailSender.setUsername(settingBag.getMailUsername());
        javaMailSender.setPort(settingBag.getMailPort());
        javaMailSender.setPassword(settingBag.getMailPassword());
        Properties properties = new Properties();
        properties.setProperty("mail.smtp.ssl.trust", "*");
        properties.setProperty("mail.smtp.timeout", "3000");
        properties.setProperty("mail.smtp.connectionTimeout", "5000");
        properties.setProperty("mail.smtp.writeTimeout", "5000");
        properties.setProperty("mail.smtp.auth", settingBag.getUseAuth());
        properties.setProperty("mail.smtp.starttls.enable", settingBag.getSMTPSecured());
        javaMailSender.setJavaMailProperties(properties);
        return javaMailSender;
    }
}
