package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.ecommercecommon.model.Address;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
class AddressRepoTest {
    @Autowired private AddressRepo addressRepo;
    @Autowired private TestEntityManager entityManager;

    @Test
    void testAddAddress(){
        Address address = new Address();
        address.setFirstName("Qadr");
        address.setLastName("Abd");
        address.setMainAddress("Aganni");
        address.setCity("Ibadan");
        address.setCountry(new Country(165));
        address.setPostalCode("234242");
        address.setPhoneNumber("1313-4142-2343");
        address.setCustomer(new Customer(12));
        address.setState("oyo");

        Address save = addressRepo.save(address);
        assertThat(save).isNotNull();
    }

    @Test
    void testUpdate(){
        Address address = entityManager.find(Address.class, 1);
        address.setState("ondo");

        Address save = addressRepo.save(address);
        assertThat(save).isNotNull();
    }

    @Test
    void testFindByIdAndCustomer(){
        Customer customer = new Customer(12);
        int id = 1;
        Optional<Address> byIdAndCustomer = addressRepo.findByIdAndCustomer(id, customer);

        assertThat(byIdAndCustomer).isPresent();

    }

    @Test
    void testFindByCustomer(){
        Customer customer = new Customer(12);
        List<Address> addresses = addressRepo.findByCustomer(customer);

        assertThat(addresses.size()).isGreaterThan(0);

    }

    @Test
    void testDeleteByCustomerAndId(){
        Customer customer = new Customer(12);
        int id  = 1;
        addressRepo.deleteByIdAndCustomer(id, customer.getId());

        Optional<Address> byIdAndCustomer = addressRepo.findByIdAndCustomer(id, customer);

        assertThat(byIdAndCustomer).isNotPresent();

    }

}