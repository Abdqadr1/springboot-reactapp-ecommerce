package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.repo.CurrencyRepo;
import com.qadr.ecommerce.ecommerceadmin.service.SettingsService;
import com.qadr.ecommerce.sharedLibrary.entities.setting.GeneralSettingBag;
import com.qadr.ecommerce.sharedLibrary.entities.Currency;
import com.qadr.ecommerce.sharedLibrary.entities.setting.Setting;
import com.qadr.ecommerce.sharedLibrary.entities.setting.SettingsBag;
import com.qadr.ecommerce.sharedLibrary.util.FileUploadUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
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
        List<Setting> allSettings = settingsService.getAllSettings();
        List<Currency> currencyList = currencyRepo.findAllByOrderByNameAsc();
        return new SettingsPage(allSettings, currencyList);
    }



    @PostMapping("/save_general")
    public String saveGeneralSettings(HttpServletRequest request,
                                      @RequestParam("fileImage") MultipartFile file) throws IOException {
        List<Setting> generalSettings = settingsService.getGeneralSettings();
        GeneralSettingBag generalSettingBag = new GeneralSettingBag(generalSettings);
        saveSiteLogo(file, generalSettingBag);
        saveCurrencySymbol(request, generalSettingBag);
        updateSettings(request, generalSettingBag);
        return "General settings saved";
    }

    @PostMapping("/save_mail_server")
    public String saveMailSettings(HttpServletRequest request){
        List<Setting> mailSettings = settingsService.getMailServerSettings();
        SettingsBag mailSettingsBag = new SettingsBag(mailSettings);
        updateSettings(request, mailSettingsBag);
        return "Mail settings saved";
    }

    @PostMapping({"/save_verify_template","/save_order_template"})
    public String saveMailTemplate(HttpServletRequest request){
        List<Setting> mailSettings = settingsService.getMailTemplateSettings();
        SettingsBag mailSettingsBag = new SettingsBag(mailSettings);
        updateSettings(request, mailSettingsBag);
        return "Mail settings saved";
    }

    @PostMapping("/save_payment")
    public String savePaymentInfo(HttpServletRequest request){
        List<Setting> mailSettings = settingsService.getPaymentSettings();
        SettingsBag mailSettingsBag = new SettingsBag(mailSettings);
        updateSettings(request, mailSettingsBag);
        return "Payment settings saved";
    }




    void saveSiteLogo(MultipartFile file, GeneralSettingBag settingBag) throws IOException {
        if(!file.isEmpty()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            String[] strings = filename.split("\\.");
            filename = "site-logo." + strings[strings.length -1];
            String dir = "site-logo";
            FileUploadUtil.cleanDir(dir);
            FileUploadUtil.saveFile(file, dir, filename);
            settingBag.updateValue("SITE_LOGO", filename);
        }
    }

    void saveCurrencySymbol(HttpServletRequest request, GeneralSettingBag settingBag){
        Integer currencyId = Integer.parseInt(request.getParameter("CURRENCY_ID"));
        currencyRepo.findById(currencyId)
                .ifPresent(currency -> settingBag.updateCurrencySymbol(currency.getSymbol()));
    }
    void updateSettings(HttpServletRequest request, SettingsBag settingBag){
        List<Setting> settingList = settingBag.getSettingList();
        for(Setting setting : settingList){
            String value = request.getParameter(setting.getKey());
            if(value != null){
                setting.setValue(value);
            }
        }
        settingsService.saveAll(settingList);
    }

}

@AllArgsConstructor
@Data
class SettingsPage{
    List<Setting> settings;
    List<Currency> currencies;
}
