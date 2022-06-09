package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.sharedLibrary.repo.CountryRepo;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/countries")
public class CountryController {
    @Autowired private CountryRepo countryRepo;

    @GetMapping("/list")
    public List<Country> listAll(){
        return countryRepo.findAllByOrderByNameAsc();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCountry(@PathVariable("id") Integer id){

        countryRepo.deleteById(id);
    }

    @PostMapping("/save")
    public Country saveCountry(@RequestBody Country country){
        return countryRepo.save(country);
    }

}
