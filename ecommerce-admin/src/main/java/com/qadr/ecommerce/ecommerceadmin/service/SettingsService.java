package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.repo.SettingsRepo;
import com.qadr.ecommerce.sharedLibrary.entities.Setting;
import com.qadr.ecommerce.sharedLibrary.entities.SettingsCategory;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SettingsService {
    @Autowired
    private SettingsRepo settingsRepo;

    public List<Setting> getByCategory(SettingsCategory category){
        return settingsRepo.findByCategoryOrderByKeyAsc(category);
    }

    public List<Setting> getGeneralSettings(){
        return settingsRepo.findByTwoCategories(SettingsCategory.GENERAL, SettingsCategory.CURRENCY);
    }


    public List<Setting> getAllSettings(){
        return settingsRepo.findAll();
    }

    public List<Setting> getMailServerSettings(){
        return settingsRepo.findByCategory(SettingsCategory.MAIL_SERVER);
    }

    public List<Setting> getMailTemplateSettings(){
        return settingsRepo.findByCategory(SettingsCategory.MAIL_TEMPLATE);
    }


    public void saveAll(List<Setting> settingBag) {
        settingsRepo.saveAll(settingBag);
    }
}
