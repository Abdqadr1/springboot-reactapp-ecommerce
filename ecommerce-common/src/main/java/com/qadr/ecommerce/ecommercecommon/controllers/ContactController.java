package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.SettingsService;
import com.qadr.ecommerce.ecommercecommon.utilities.Util;
import com.qadr.ecommerce.sharedLibrary.entities.Contact;
import com.qadr.ecommerce.sharedLibrary.entities.setting.EmailSettingBag;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
public class ContactController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ContactController.class);
    @Autowired private SettingsService settingsService;

    @PostMapping
    public void sendMail(Contact contact){
        sendConfirmationEmail(contact);
    }

    private void sendConfirmationEmail(Contact contact) {
        try {
            EmailSettingBag emailSettings = settingsService.getEmailSettingsBag();
            String subject = contact.getName() + "sent you a message on QShop";
            Util.sendEmail(emailSettings, contact.getEmail(), subject, contact.getMessage());
        } catch (Exception e) {
            LOGGER.info(e.getMessage());
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not send message, Try again later");
        }

    }

}
