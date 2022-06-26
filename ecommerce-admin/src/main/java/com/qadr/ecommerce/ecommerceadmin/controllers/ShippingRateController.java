package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.ShippingRateService;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/shipping_rate")
public class ShippingRateController {
    public static final Logger LOGGER = LoggerFactory.getLogger(ShippingRateController.class);

    @Autowired
    private ShippingRateService shippingRateService;

    @GetMapping("/countries")
    public List<Country> listCountries(){
        return shippingRateService.getAllCountries();
    }

    @GetMapping("/states")
    public List<State> listStates(@RequestParam("id") Integer id){
        return shippingRateService.getCountryStates(new Country(id));
    }

    @PostMapping("/get_shipping_rate")
    public float getShippingRate(HttpServletRequest request){
        String productId = request.getParameter("product");
        String countryId = request.getParameter("country");
        String state = request.getParameter("state");
        if(productId == null || countryId == null || state == null){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid parameters");
        }
        return shippingRateService.getShippingRate(Integer.valueOf(productId), Integer.valueOf(countryId), state);
    }

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("rates") PagingAndSortingHelper helper){

        return shippingRateService.getPage(number, helper);
    }

    @GetMapping("/{id}/cod/{status}")
    public String updateCCOD(@PathVariable("id") Integer id,
                                @PathVariable("status") boolean status){
        return shippingRateService.updateCOD(id, status);
    }


    @PostMapping({"/edit", "/add"})
    public ShippingRate editRate(@Valid ShippingRate rate) {
        return shippingRateService.saveShippingRate(rate);
    }


    @GetMapping("/delete/{id}")
    public ShippingRate deleteRate(@PathVariable("id") Integer id){
        return shippingRateService.deleteShippingRate(id);
    }
}
