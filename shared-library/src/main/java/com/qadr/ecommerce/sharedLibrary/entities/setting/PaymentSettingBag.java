package com.qadr.ecommerce.sharedLibrary.entities.setting;

import java.util.List;

public class PaymentSettingBag  extends SettingsBag{

    public PaymentSettingBag(List<Setting> settingList) {
        super(settingList);
    }
    public String getPaymentUrl(){
        return super.getValue("PAYPAL_API_BASE_URL");
    }
    public String getPaymentSecret(){
        return super.getValue("PAYPAL_API_CLIENT_SECRET");
    }

    public String getPaymentId(){
        return super.getValue("PAYPAL_API_CLIENT_ID");
    }
}
