package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.ProductRepo;
import com.qadr.ecommerce.sharedLibrary.repo.ShippingRateRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.function.Executable;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
class ShippingRateServiceTest {
    @MockBean private ShippingRateRepo shippingRateRepo;
    @MockBean private ProductRepo productRepo;

    @InjectMocks
    private ShippingRateService shippingRateService;

    @Test
    void testGetShippingRate_NoRateFound(){
        int productId =1, countryId =165; String state = "ahaha";
        Mockito.when(shippingRateRepo.findByCountryAndState(countryId, state)).thenReturn(Optional.empty());

        assertThrows(CustomException.class, new Executable() {
            @Override
            public void execute() throws Throwable {
                shippingRateService.getShippingRate(productId, countryId, state);
            }
        });
    }
    @Test
    void testGetShippingRate_RateFound(){
        int productId =1, countryId = 165; String state = "oyo";
        ShippingRate shippingRate = new ShippingRate();
        shippingRate.setRate(12f);
        Product product = new Product();
        product.setWeight(12);
        product.setWidth(0); product.setLength(0);product.setWidth(0);
        Mockito.when(shippingRateRepo.findByCountryAndState(countryId, state)).thenReturn(Optional.of(shippingRate));

        Mockito.when(productRepo.findById(productId)).thenReturn(Optional.of(product));

        float rate = shippingRateService.getShippingRate(productId, countryId, state);
        assertThat(rate).isEqualTo(144f);
    }
}