package com.qadr.ecommerce.ecommercecommon.utilities;

import com.qadr.ecommerce.sharedLibrary.entities.setting.EmailSettingBag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.Properties;

public class Util {
    public static final Logger LOGGER = LoggerFactory.getLogger(Util.class);

    public static String getSiteURL(HttpServletRequest request){
        String siteURL = request.getRequestURL().toString();
        siteURL = siteURL.replace(request.getServletPath(), "");
        return siteURL;
    }
    public static Session getMailSession(EmailSettingBag settingBag){
        Properties properties = new Properties();
        properties.put("mail.smtp.host", settingBag.getMailHost()); //SMTP Host
        properties.put("mail.smtp.socketFactory.port", settingBag.getMailPort()); //SSL Port
        properties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        properties.put("mail.smtp.port", settingBag.getMailPort()); //TLS Port
        properties.put("mail.smtp.timeout", "25000");
        properties.put("mail.smtp.connectionTimeout", "10000");
        properties.put("mail.smtp.writeTimeout", "10000");
        properties.put("mail.smtp.auth", settingBag.getUseAuth());
        properties.put("mail.smtp.starttls.enable", settingBag.getSMTPSecured());

        Authenticator auth = new Authenticator() {
            //override the getPasswordAuthentication method
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(settingBag.getMailUsername(), settingBag.getMailPassword());
            }
        };
        return Session.getInstance(properties, auth);
    }

    public static void sendEmail(EmailSettingBag settingBag, String toEmail, String subject, String body){
        try
        {
            MimeMessage msg = new MimeMessage(getMailSession(settingBag));
            //set message headers
            msg.addHeader("Content-Type", "text/HTML; charset=UTF-8");
            msg.addHeader("format", "flowed");
            msg.addHeader("Content-Transfer-Encoding", "8bit");

            msg.setFrom(new InternetAddress(settingBag.getMailFrom(), settingBag.getMailSenderName()));

            msg.setReplyTo(InternetAddress.parse(settingBag.getMailFrom(), false));

            msg.setSubject(subject, "UTF-8");

            msg.setContent(body, "text/html; charset=utf-8");

            msg.setSentDate(new Date());

            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail, false));
            Transport.send(msg);

            System.out.println("EMail Sent Successfully!!");
        }
        catch (Exception e) {
            LOGGER.error("Email sender 2: ", e);
        }
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
        javaMailSender.setDefaultEncoding("utf-8");
        return javaMailSender;
    }
}
