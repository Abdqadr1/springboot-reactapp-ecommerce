package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.Address;
import com.qadr.ecommerce.ecommercecommon.repo.AddressRepo;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.CountryRepo;
import com.qadr.ecommerce.sharedLibrary.repo.StateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class AddressService {
    @Autowired private AddressRepo addressRepo;
    @Autowired private CountryRepo countryRepo;
    @Autowired private StateRepo stateRepo;



    public List<Address> getAllByCustomer(Customer customer) {
        return addressRepo.findByCustomer(customer);
    }

    public Address saveAddress(Address address) {
        return addressRepo.save(address);
    }

    public Address deleteByCustomer(Integer id, Customer customer){
        Address address = addressRepo.findByIdAndCustomer(id, customer)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Address does not exist"));
        addressRepo.deleteByIdAndCustomer(id, customer.getId());
        return address;
    }

    public void setDefaultAddress(Integer id){
        addressRepo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "Address does not exist"));
        addressRepo.setDefaultAddress(id);
    }


    public List<Country> findAllCountries(){
        return countryRepo.findAllByOrderByNameAsc();
    }

    public List<State> findStates(Country country){
        return stateRepo.findByCountryOrderByNameAsc(country);
    }
}
