package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.sharedLibrary.entities.Setting;
import com.qadr.ecommerce.sharedLibrary.entities.SettingsCategory;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.SettingsRepo;
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


    public void saveAll(List<Setting> settingBag) {
        settingsRepo.saveAll(settingBag);
    }
}
