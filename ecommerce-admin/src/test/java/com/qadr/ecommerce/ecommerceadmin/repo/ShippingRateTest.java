package com.qadr.ecommerce.ecommerceadmin.repo;


import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.repo.ShippingRateRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.annotation.Rollback;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class ShippingRateTest {
    @Autowired private ShippingRateRepo shippingRateRepo;

    @Test
    void testAddShippingRate(){
        ShippingRate shippingRate = new ShippingRate();
        shippingRate.setRate(9.5F);
        shippingRate.setCountry(new Country(21));
        shippingRate.setDays(7);
        shippingRate.setState("ondo");
        shippingRateRepo.save(shippingRate);
    }

    @Test
    void testFindByCountryAndState(){
        int countryId = 34;
        String state = "oyo";
        Optional<ShippingRate> countryAndState = shippingRateRepo.findByCountryAndState(countryId, state);
        assertThat(countryAndState).isPresent();
    }
    @Test
    void testSearchKeyword(){
        String keyword = "oyo";
        PageRequest request = PageRequest.of(0, 5);
        Page<ShippingRate> page = shippingRateRepo.searchKeyword(keyword, request);
        assertThat(page.getContent().size()).isGreaterThan(0);

    }

    @Test
    void testUpdateCOD(){
        int id = 1;
        shippingRateRepo.changeSupported(id, true);
        ShippingRate rate = shippingRateRepo.findById(id).get();
        assertThat(rate.isCOD()).isTrue();
    }
}
