package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StateRepo extends JpaRepository<State, Integer> {

    List<State> findAllByOrderByNameAsc();

    List<State> findByCountryOrderByNameAsc(Country country);
}
