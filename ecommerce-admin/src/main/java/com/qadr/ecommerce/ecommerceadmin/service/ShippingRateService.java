package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.repo.CountryRepo;
import com.qadr.ecommerce.sharedLibrary.repo.ProductRepo;
import com.qadr.ecommerce.sharedLibrary.repo.ShippingRateRepo;
import com.qadr.ecommerce.sharedLibrary.repo.StateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
public class ShippingRateService {
    public static final int RATES_PER_PAGE = 10;
    public static final int DIM_DIVISOR = 139;
    @Autowired private ShippingRateRepo repo;
    @Autowired private ProductRepo productRepo;
    @Autowired private CountryRepo countryRepo;
    @Autowired private StateRepo stateRepo;

    public String updateCOD(Integer id, boolean status) {
        repo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "No shipping rate found with the id"));
        repo.changeSupported(id, status);

        return "Shipping rate COD updated";
    }

    public Map<String, Object> getPage(int pageNumber, PagingAndSortingHelper helper){
        return helper.getPageInfo(pageNumber, RATES_PER_PAGE, repo);
    }

    public float getShippingRate(Integer productId, Integer countryId, String state){
        ShippingRate shippingRate = repo.findByCountryAndState(countryId, state)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST,
                        "Could not find shipping rate for the destination, You have to enter it manually"));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Could not find product"));

        float dimWeight = product.getHeight() * product.getWidth() * product.getLength() / DIM_DIVISOR;
        float finalWeight = Math.max(dimWeight, product.getWeight());
        return  finalWeight * shippingRate.getRate();
    }



    public List<ShippingRate> getAll() {
        return repo.findAll(Sort.by("id").ascending());
    }

    public ShippingRate deleteShippingRate(Integer id) {
         ShippingRate rate = repo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "No shipping rate found with the id"));
        repo.deleteById(id);
        return rate;
    }

    public ShippingRate saveShippingRate(ShippingRate shippingRate) {
        Integer id = shippingRate.getId(), countryId = shippingRate.getCountry().getId();
        String state = shippingRate.getState();

        Optional<ShippingRate> byCountryAndState = repo.findByCountryAndState(countryId, state);

        if(byCountryAndState.isPresent() && !Objects.equals(byCountryAndState.get().getId(), id)){
            throw new CustomException(HttpStatus.BAD_REQUEST, "There's already a shipping rate with the country and state");
        }
        return repo.save(shippingRate);
    }


    public List<Country> getAllCountries(){
        return countryRepo.findAllByOrderByNameAsc();
    }
    public List<State> getCountryStates(Country country){
        return stateRepo.findByCountryOrderByNameAsc(country);
    }
}
