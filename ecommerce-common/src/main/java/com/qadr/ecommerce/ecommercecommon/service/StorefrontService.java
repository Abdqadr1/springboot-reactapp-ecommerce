package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.sharedLibrary.entities.storefront.Storefront;
import com.qadr.ecommerce.sharedLibrary.repo.StorefrontRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StorefrontService {
    @Autowired private StorefrontRepo repo;

    public List<Storefront> getAllEnabled(){
        return repo.findByEnabled(true, Sort.by("position").ascending());
    }
}
