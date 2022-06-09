package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import com.qadr.ecommerce.sharedLibrary.repo.StateRepo;
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
class StateRepoTest {
    @Autowired private StateRepo repo;
    @Autowired private TestEntityManager entityManager;

    @Test
    void addStates(){
        Country country = entityManager.find(Country.class, 5);
        List<State> usStates = List.of(
                new State("New York", country),
                new State("Washington DC", country),
                new State("Atlanta Georgia", country),
                new State("Florid", country)
                );

        List<State> states = repo.saveAll(usStates);
        assertThat(states.size()).isGreaterThan(0);
    }

    @Test
    void testUpdateState(){
        State state = entityManager.find(State.class, 4);
        state.setName("Florida");
        State save = repo.save(state);
        assertThat(save).isNotNull();
    }

    @Test
    void testDeleteState(){
        int id = 3;
        repo.deleteById(id);
        Optional<State> byId = repo.findById(id);
        assertThat(byId).isNotPresent();
    }

    @Test
    void listAll(){
        List<State> all = repo.findAllByOrderByNameAsc();
        all.forEach(System.out::println);
        assertThat(all.size()).isGreaterThan(0);
    }


}