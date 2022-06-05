package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Currency;
import com.qadr.ecommerce.sharedLibrary.repo.CurrencyRepo;
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
class CurrencyRepoTest {
    @Autowired
    private CurrencyRepo currencyRepo;


    @Test
    void testAddCurrency(){
        List<Currency> currencies = List.of(
                new Currency("US Dollar", "$", "USD"),
                new Currency("British Pound", "£", "GPB"),
                new Currency("Japanese Yen", "¥", "JPY"),
                new Currency("Euro", "€", "EUR"),
                new Currency("Russian Rubble", "₽", "RUB"),
                new Currency("South Korean Won", "₩", "KRW"),
                new Currency("Chinese Yuan", "¥", "CNY"),
                new Currency("Brazilian Dollar", "R$", "BRL"),
                new Currency("Australian Dollar", "$", "AUD"),
                new Currency("Canadian Dollar", "$", "CAD"),
                new Currency("Vietnamese dong", "₫", "VND"),
                new Currency("Indian Rupee", "₹", "INR"),
                new Currency("Nigerian Naira", "₦", "NGN")
        );
        List<Currency> saveAll = currencyRepo.saveAll(currencies);
        assertThat(saveAll.size()).isEqualTo(currencies.size());
    }

    @Test
    void findAllOrderByName(){
        List<Currency> allByOrderByNameAsc = currencyRepo.findAllByOrderByNameAsc();
        allByOrderByNameAsc.forEach(System.out::println);
    }

}