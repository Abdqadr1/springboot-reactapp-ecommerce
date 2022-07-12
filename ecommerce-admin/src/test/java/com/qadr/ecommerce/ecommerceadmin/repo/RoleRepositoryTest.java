package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Role;
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
class RoleRepositoryTest {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void testingRepo(){
        Role role = new Role("Admin", "Manages everything");
        Role newRole = roleRepository.save(role);
        System.out.println(role.toString());
        assertThat(newRole.getId()).isGreaterThan(0);
    }

    @Test
    void testingAddingRestRoles(){
        List<Role> roles = List.of(
                new Role("Salesperson", "Manages product price, customers, shipping, orders, and sales report"),
                new Role("Editor", "Manages categories, brands, products, articles, and menus"),
                new Role("Shipper", "view products, view orders, and update order status"),
                new Role("Assistant", "Manages questions and reviews")
        );

        List<Role> saveAll = roleRepository.saveAll(roles);
        assertThat(saveAll.size()).isEqualTo(roles.size());
    }
}