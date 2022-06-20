package com.qadr.ecommerce.sharedLibrary.entities.setting;

import com.qadr.ecommerce.sharedLibrary.entities.setting.Setting;
import com.qadr.ecommerce.sharedLibrary.entities.setting.SettingsBag;

import java.util.List;

public class GeneralSettingBag extends SettingsBag {
    public GeneralSettingBag(List<Setting> settingList) {
        super(settingList);
    }

    public void updateCurrencySymbol(String value) {
        super.updateValue("CURRENCY_SYMBOL", value);
    }
}
