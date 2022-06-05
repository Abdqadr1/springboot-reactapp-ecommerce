package com.qadr.ecommerce.sharedLibrary.entities;

import java.util.List;

public class GeneralSettingBag extends SettingsBag{
    public GeneralSettingBag(List<Setting> settingList) {
        super(settingList);
    }

    public void updateCurrencySymbol(String value) {
        super.updateValue("CURRENCY_SYMBOL", value);
    }
}
