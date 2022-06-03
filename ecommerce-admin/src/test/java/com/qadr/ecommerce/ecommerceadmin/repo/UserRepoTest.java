package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.ecommerceadmin.model.Role;
import com.qadr.ecommerce.ecommerceadmin.model.User;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.annotation.Rollback;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class UserRepoTest {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @Order(1)
    void testingUserRepo(){
        Role roleAdmin = entityManager.find(Role.class, 5);
        User user = new User("abolarinwa@gmail.com", "discowale", "Qadr", "Abd");
        user.addRole(roleAdmin);
        User save = userRepo.save(user);

        assertThat(save.getEmail()).isEqualTo(user.getEmail());
        assertThat(save.getRoles().stream().findFirst().isPresent()).isTrue();
    }

    @Test
    @Order(2)
    void createUserWithTwoRoles(){
        Role editorRole = new Role(2);
        Role assistantRole = new Role(4);
        User user = new User("abolarinwa2@gmail.com", "discowale", "Qadr", "Abd");
        user.addRole(editorRole);
        user.addRole((assistantRole));
        User save = userRepo.save(user);

        assertThat(save.getId()).isGreaterThan(0);
        assertThat(save.getRoles().size()).isEqualTo(2);
    }

    @Test
    @Order(3)
    void listAllUsers(){
        List<User> all = userRepo.findAll();
        assertThat(all.size()).isGreaterThan(1);

        all.forEach(System.out::println);
    }

    @Test
    @Order(4)
    void getById(){
        User byId = userRepo.findById(2L).get();
        assertThat(byId).isNotNull();
    }

    @Test
    @Order(5)
    void testUpdateUser(){
        User user = userRepo.findById(2L).get();
        user.setEnabled(true);
        user.setEmail("abdqadr@gmail.com");
    }
    @Test
    @Order(6)
    void addRemoveRole(){
        Role roleSalePerson = entityManager.find(Role.class, 2);
        Role roleAssistant = new Role(4);
        User user = userRepo.findById(3L).get();
        boolean remove = user.getRoles().remove(roleSalePerson);
        assertThat(remove).isTrue();
        user.addRole(roleAssistant);
        userRepo.save(user);
    }
    @Test
    @Order(7)
    void testDeleteUser(){
        List<User> all = userRepo.findAll();
        User user = all.get(all.size() - 1);
        userRepo.deleteById(user.getId());
    }

    @Test
    void testEnableUser(){
        userRepo.setUserEnableStatus(8L, false);
    }

    @Test
    void testPagination(){
        int pageNumber = 0;
        int pageSize = 4;
        String keyword = "abdqadr6@gmail.com";

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<User> page = userRepo.searchKeyword(keyword, pageable);

        List<User> users = page.getContent();
        System.out.println(users);
        assertThat(users.size()).isGreaterThan(0);

    }

}