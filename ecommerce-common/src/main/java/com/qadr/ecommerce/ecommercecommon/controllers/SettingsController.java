package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.repo.CurrencyRepo;
import com.qadr.ecommerce.ecommercecommon.service.SettingsService;
import com.qadr.ecommerce.sharedLibrary.entities.Currency;
import com.qadr.ecommerce.sharedLibrary.entities.setting.Setting;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/set")
public class SettingsController {
    @Autowired
    private SettingsService settingsService;

    @Autowired
    private CurrencyRepo currencyRepo;

    @GetMapping("/get")
    public SettingsPage getAllSettings(){
        List<Setting> allSettings = settingsService.getGeneralSettings();
        List<Currency> currencyList = currencyRepo.findAllByOrderByNameAsc();
        return new SettingsPage(allSettings, currencyList);
    }

}

@AllArgsConstructor
@Data
class SettingsPage{
    List<Setting> settings;
    List<Currency> currencies;
}
