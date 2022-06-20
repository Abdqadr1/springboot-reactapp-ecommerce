package com.qadr.ecommerce.sharedLibrary.entities.setting;

import com.qadr.ecommerce.sharedLibrary.entities.setting.Setting;
import com.qadr.ecommerce.sharedLibrary.entities.setting.SettingsBag;

import java.util.List;

public class EmailSettingBag extends SettingsBag {
    public EmailSettingBag(List<Setting> settingList) {
        super(settingList);
    }

    public String getMailHost(){
        return super.getValue("MAIL_HOST");
    }
    public int getMailPort(){
        return Integer.parseInt(super.getValue("MAIL_PORT"));
    }
    public String getMailFrom(){
        return super.getValue("MAIL_FROM");
    }
    public String getMailPassword(){
        return super.getValue("MAIL_PASSWORD");
    }
    public String getMailUsername(){
        return super.getValue("MAIL_USERNAME");
    }
    public String getMailSenderName(){
        return super.getValue("MAIL_SENDER_NAME");
    }
    public String getUseAuth(){
        return super.getValue("SMTP_AUTH");
    }
    public String getSMTPSecured(){
        return super.getValue("SMTP_SECURED");
    }

    public String getVerifySubject(){
        return super.getValue("CUSTOMER_VERIFY_SUBJECT");
    }
    public String getVerifyContent(){
        return super.getValue("CUSTOMER_VERIFY_CONTENT");
    }
}
