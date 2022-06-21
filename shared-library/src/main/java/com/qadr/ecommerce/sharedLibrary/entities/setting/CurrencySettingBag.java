package com.qadr.ecommerce.sharedLibrary.entities.setting;

import java.util.List;

public class CurrencySettingBag extends SettingsBag{

    public CurrencySettingBag(List<Setting> settingList) {
        super(settingList);
    }
    public String getCurrencyId(){
        return super.getValue("CURRENCY_ID");
    }
    public String getCurrencySymbol(){
        return super.getValue("CURRENCY_SYMBOL");
    }

    public String getSymbolPosition(){
        return super.getValue("CURRENCY_SYMBOL_POSITION");
    }
    public Integer getDecimalDigit(){
        return Integer.valueOf(super.getValue("DECIMAL_DIGIT"));
    }

    public String getDecimalPointType(){
        return super.getValue("DECIMAL_POINT_TYPE");
    }
    public String getThousandType(){
        return super.getValue("THOUSANDS_POINT_TYPE");
    }
}
