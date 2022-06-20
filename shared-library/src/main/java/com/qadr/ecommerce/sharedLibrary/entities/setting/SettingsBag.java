package com.qadr.ecommerce.sharedLibrary.entities.setting;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@RequiredArgsConstructor
public class SettingsBag {
    private final List<Setting> settingList;

    public Setting getByKey(String key){
        Setting needle = new Setting(key);
        int index = settingList.indexOf(needle);
        if(index > -1) {
            return settingList.get(index);
        }
        return null;
    }
    public String getValue(String key){
        Setting byKey = getByKey(key);
        if(byKey != null) return byKey.getValue();
        return null;
    }


    public void updateValue(String key, String value){
        Setting setting = getByKey(key);
        if (setting != null && value != null){
            setting.setValue(value);
        }
    }
}
