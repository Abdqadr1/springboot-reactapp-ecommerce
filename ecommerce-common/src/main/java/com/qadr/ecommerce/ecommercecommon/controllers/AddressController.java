package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.sharedLibrary.entities.Address;
import com.qadr.ecommerce.ecommercecommon.service.AddressService;
import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {
    @Autowired private AddressService addressService;
    @Autowired private CustomerService customerService;
    @Autowired private ControllerHelper controllerHelper;

    @GetMapping("/countries")
    public List<Country> getAllCountries (){
        return addressService.findAllCountries();
    }

    @GetMapping("/states")
    public List<State> getAllCountries (@RequestParam Integer id){
        return addressService.findStates(new Country(id));
    }

    @GetMapping
    public List<Address> getByCustomer(){
        Customer customer = controllerHelper.getCustomerDetails();
        Address address = getAddressFromCustomer(customer);
        List<Address> addresses = new ArrayList<>();
        List<Address> all = addressService.getAllByCustomer(customer);

        boolean isDefaultAddress = all.stream().anyMatch(Address::isDefaultAddress);
         if (!isDefaultAddress) address.setDefaultAddress(true);

        addresses.add(address);
        addresses.addAll(all);
        return addresses;
    }

    @PostMapping({"/add", "/edit"})
    public Address saveAddress(@Valid Address address){
        Customer customer = controllerHelper.getCustomerDetails();
        address.setCustomer(customer);
        return addressService.saveAddress(address);
    }

    @DeleteMapping("/remove/{id}")
    public String removeItemInShoppingCart(@PathVariable("id") Integer id){
        Customer customer = controllerHelper.getCustomerDetails();
        addressService.deleteByCustomer(id, customer);
        return  "Address removed successfully";
    }

    @GetMapping("/default/{id}")
    public String setDefault(@PathVariable("id") Integer id){
        Customer customer = controllerHelper.getCustomerDetails();
        addressService.setDefaultAddress(id, customer);
        return  "Address has been set has default";
    }

    public static Address getAddressFromCustomer(Customer customer){
        Address address = new Address();
        address.setId(-1);
        address.setFirstName(customer.getFirstName());
        address.setLastName(customer.getLastName());
        address.setMainAddress(customer.getMainAddress());
        address.setExtraAddress(customer.getExtraAddress());
        address.setPhoneNumber(customer.getPhoneNumber());
        address.setState(customer.getState());
        address.setCity(customer.getCity());
        address.setPostalCode(customer.getPostalCode());
        address.setCountry(customer.getCountry());
        address.setDefaultAddress(false);
        return address;
    }
}
