package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.repo.CurrencyRepo;
import com.qadr.ecommerce.sharedLibrary.entities.Currency;
import com.qadr.ecommerce.sharedLibrary.entities.setting.*;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.SettingsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SettingsService {
    @Autowired private SettingsRepo settingsRepo;
    @Autowired private CurrencyRepo currencyRepo;

    public List<Setting> getByCategory(SettingsCategory category){
        return settingsRepo.findByCategoryOrderByKeyAsc(category);
    }

    public List<Setting> getGeneralSettings(){
        return settingsRepo.findByTwoCategories(SettingsCategory.GENERAL, SettingsCategory.CURRENCY);
    }

    public EmailSettingBag getEmailSettingsBag(){
        List<Setting> settingList = settingsRepo.
                findByTwoCategories(SettingsCategory.MAIL_SERVER, SettingsCategory.MAIL_TEMPLATE);
        return new EmailSettingBag(settingList);
    }

    public CurrencySettingBag getCurrencySettingBag(){
        List<Setting> settingList = settingsRepo.findByCategory(SettingsCategory.CURRENCY);
        return new CurrencySettingBag(settingList);
    }


    public List<Setting> getAllSettings(){
        return settingsRepo.findAll();
    }


    public void saveAll(List<Setting> settingBag) {
        settingsRepo.saveAll(settingBag);
    }

    public PaymentSettingBag getPaymentSettingBag(){
        List<Setting> settingList = settingsRepo.findByCategory(SettingsCategory.PAYMENT);
        return new PaymentSettingBag(settingList);
    }
    public Currency getCurrency(){
        Setting setting = settingsRepo.findById("CURRENCY_ID")
                .orElseThrow(() -> new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not find currency id settings"));
        Integer currencyId = Integer.valueOf(setting.getValue());
        return currencyRepo.findById(currencyId)
                .orElseThrow(()-> new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not find currency"));
    }
}
