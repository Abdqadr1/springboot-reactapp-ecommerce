package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.repo.ShippingRateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ShippingRateService {
    @Autowired private ShippingRateRepo shippingRateRepo;

    public Optional<ShippingRate> findByCountryAndState(Integer country, String state){
        return shippingRateRepo.findByCountryAndState(country, state);
    }
}
