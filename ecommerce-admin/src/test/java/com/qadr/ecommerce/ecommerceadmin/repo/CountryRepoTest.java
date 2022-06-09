package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.repo.CountryRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class CountryRepoTest {

    @Autowired
    private CountryRepo countryRepo;

    @Autowired
    private TestEntityManager testEntityManager;

    @Test
    void testAddCountry(){
        Country country = new Country("United States Of America", "USA");
        country.addState("New York");
        country.addState("Washington DC");
        Country save = countryRepo.save(country);

        assertThat(save).isNotNull();
    }

    @Test
    void testAddStates(){
        Country country = new Country("Canada", "CA");
        Country save = countryRepo.save(country);
        System.out.println(save);
        assertThat(save).isNotNull();
    }


    @Test
    void testListAll(){
        List<Country> allByOrderByNameAsc = countryRepo.findAllByOrderByNameAsc();
        allByOrderByNameAsc.forEach(System.out::println);
        assertThat(allByOrderByNameAsc.size()).isGreaterThan(0);
    }

    @Test
    void testUpdate(){
        Country ghana = testEntityManager.find(Country.class, 2);
        ghana.setCode("GH");
        Country save = countryRepo.save(ghana);

        assertThat(save).isNotNull();
        assertThat(save.getName()).isEqualTo(ghana.getName());
    }

    @Test
    void testDeleteCountry(){
        int id = 2;
        countryRepo.deleteById(id);
        Optional<Country> byId = countryRepo.findById(id);
        assertThat(byId).isNotPresent();
    }
}
