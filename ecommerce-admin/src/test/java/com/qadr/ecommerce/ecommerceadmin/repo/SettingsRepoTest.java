package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.setting.Setting;
import com.qadr.ecommerce.sharedLibrary.entities.setting.SettingsCategory;
import com.qadr.ecommerce.sharedLibrary.repo.SettingsRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class SettingsRepoTest {
    @Autowired
    private SettingsRepo settingsRepo;

    @Test
    void testAddGeneralSettings(){
        Setting setting = new Setting("SITE_NAME", "e-Commerce", SettingsCategory.GENERAL);
        Setting setting1 = new Setting("SITE_LOGO", "e-commerce.png", SettingsCategory.GENERAL);
        Setting setting2 = new Setting("COPYRIGHT", "Copyright @ e-Commerce 2022", SettingsCategory.GENERAL);
        List<Setting> list = List.of(setting, setting1, setting2);
    }

    @Test
    void testAddCurrencySettings(){
        Setting currencyId = new Setting("CURRENCY_ID", "1", SettingsCategory.CURRENCY);
        Setting currencySymbol = new Setting("CURRENCY_SYMBOL", "$", SettingsCategory.CURRENCY);
        Setting symbolPosition = new Setting("CURRENCY_SYMBOL_POSITION", "before", SettingsCategory.CURRENCY);
        Setting decimalPoint = new Setting("DECIMAL_POINT_TYPE", "POINT", SettingsCategory.CURRENCY);
        Setting decimalDigit = new Setting("DECIMAL_DIGIT", "2", SettingsCategory.CURRENCY);
        Setting thousandPoint = new Setting("THOUSANDS_POINT_TYPE", "COMMA", SettingsCategory.CURRENCY);

        List<Setting> settingList =
                List.of(currencyId, currencySymbol, decimalPoint, decimalDigit, symbolPosition, thousandPoint);

        List<Setting> save = settingsRepo.saveAll(settingList);

        assertThat(save.size()).isGreaterThan(1);

    }
    @Test
    void testAddMailServerSettings(){
        List<Setting> settings = List.of(
                new Setting("MAIL_HOST", "smtp.gmail.com", SettingsCategory.MAIL_SERVER),
                new Setting("MAIL_PORT", "587", SettingsCategory.MAIL_SERVER),
                new Setting("MAIL_USERNAME", "ecommerce@gmail.com", SettingsCategory.MAIL_SERVER),
                new Setting("MAIL_PASSWORD", "password", SettingsCategory.MAIL_SERVER),
                new Setting("SMTP_AUTH", "true", SettingsCategory.MAIL_SERVER),
                new Setting("SMTP_SECURED", "true", SettingsCategory.MAIL_SERVER),
                new Setting("MAIL_FROM", "ecommerce@gmail.com", SettingsCategory.MAIL_SERVER),
                new Setting("MAIL_SENDER_NAME", "E-commerce app", SettingsCategory.MAIL_SERVER),
                new Setting("CUSTOMER_VERIFY_SUBJECT", "email verify subject", SettingsCategory.MAIL_SERVER),
                new Setting("CUSTOMER_VERIFY_CONTENT", "email verify content", SettingsCategory.MAIL_TEMPLATE)
        ) ;
        List<Setting> saveAll = settingsRepo.saveAll(settings);
        assertThat(saveAll.size()).isEqualTo(settings.size());
    }

    @Test
    void testFindByCategory(){
        List<Setting> settingList =
                settingsRepo.findByCategoryOrderByKeyAsc(SettingsCategory.GENERAL);

        settingList.forEach(System.out::println);

        assertThat(settingList.size()).isGreaterThan(0);
    }

    @Test
    void testFindByTwoCategories(){
        List<Setting> settingList =
                settingsRepo.findByTwoCategories(SettingsCategory.GENERAL, SettingsCategory.CURRENCY);

        settingList.forEach(System.out::println);

        assertThat(settingList.size()).isGreaterThan(0);
    }
}