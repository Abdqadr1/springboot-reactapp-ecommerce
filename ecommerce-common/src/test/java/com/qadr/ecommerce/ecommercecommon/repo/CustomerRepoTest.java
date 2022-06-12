package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.AuthType;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.repo.CustomerRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class CustomerRepoTest {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void testAddCustomer(){
        Country ngn = entityManager.find(Country.class, 3);
        Customer customer = new Customer();
        customer.setCreatedTime(LocalDateTime.now());
        customer.setEmail("abdqadr1@gmail.com");
        customer.setFirstName("Qadr");
        customer.setLastName("Abd");
        customer.setCountry(ngn);
        customer.setMainAddress("Inalende");
        customer.setState("Oyo");
        customer.setCity("Ibadan");
        customer.setPostalCode("260233");
        customer.setPhoneNumber("09038539654");
        customer.setPassword("abolarinwa");

        Customer save = customerRepo.save(customer);
        assertThat(save).isNotNull();
        assertThat(save.getEmail()).isEqualTo(customer.getEmail());
    }

    @Test
    void testUpdateCustomer(){
        Customer customer = entityManager.find(Customer.class, 1);
        customer.setEnabled(true);
        Customer save = customerRepo.save(customer);
        assertThat(save).isNotNull();
        assertThat(save.getEmail()).isEqualTo(customer.getEmail());
    }

    @Test
    void listCustomers(){
        List<Customer> all = customerRepo.findAll();
        all.forEach(System.out::println);
    }

    @Test
    void deleteCustomer(){
        int id = 1;
        customerRepo.deleteById(id);
        Optional<Customer> byId = customerRepo.findById(id);
        assertThat(byId).isNotPresent();
    }

    @Test
    void testChangeAuthType(){
        customerRepo
                .findAll()
                .forEach(customer -> {
                    customerRepo.changeAuthType(customer.getId(), AuthType.DATABASE);
                });
    }


}