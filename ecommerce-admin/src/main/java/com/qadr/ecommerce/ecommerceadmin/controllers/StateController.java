package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.sharedLibrary.repo.StateRepo;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/states")
public class StateController {

    @Autowired
    private StateRepo stateRepo;

    @PostMapping("/list")
    public List<State> listAll(@RequestBody Country country){
        return stateRepo.findByCountryOrderByNameAsc(country);
    }

    @GetMapping("/get")
    public List<State> listAll(@RequestParam("id") Integer country){
        return stateRepo.findByCountryOrderByNameAsc(new Country(country));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCountry(@PathVariable("id") Integer id){

        stateRepo.deleteById(id);
    }

    @PostMapping("/save")
    public State saveCountry(@RequestBody State state){
        return stateRepo.save(state);
    }

}
