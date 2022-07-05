package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.repo.CurrencyRepo;
import com.qadr.ecommerce.ecommercecommon.service.SettingsService;
import com.qadr.ecommerce.sharedLibrary.entities.Currency;
import com.qadr.ecommerce.sharedLibrary.entities.setting.Setting;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/set")
public class SettingsController {
    @Autowired
    private SettingsService settingsService;

    @Autowired
    private CurrencyRepo currencyRepo;

    @GetMapping("/get")
    public Map<String, List<?>> getAllSettings(){
        Map<String, List<?>> res = new HashMap<>();
        res.put("settings", settingsService.getGeneralSettings());
        res.put("currencies", currencyRepo.findAllByOrderByNameAsc());
        return res;
    }

}