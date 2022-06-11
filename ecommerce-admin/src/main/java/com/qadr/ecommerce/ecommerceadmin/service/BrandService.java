package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import com.qadr.ecommerce.ecommerceadmin.model.CategoryDTO;
import com.qadr.ecommerce.ecommerceadmin.repo.BrandRepo;
import com.qadr.ecommerce.ecommerceadmin.repo.CategoryRepo;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BrandService {

    public static final int BRANDS_PER_PAGE = 5;

    @Autowired
    private BrandRepo brandRepo;
    @Autowired
    private CategoryRepo categoryRepo;

    public List<CategoryDTO> getBrandCat(Integer id){
        Brand brand = brandRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Brand not found"));
        return brand.getCategories()
                .stream()
                .map((category) -> new CategoryDTO(category.getId(), category.getName()))
                .collect(Collectors.toList());

    }

    public List<Brand> getAll(){ return brandRepo.findAll(); }

    public Map<String, Object> getPage(int number, PagingAndSortingHelper helper){
        return helper.getPageInfo(number, BRANDS_PER_PAGE, brandRepo);
    }

    public Brand addBrand(Brand brand){
        Optional<Brand> byName = brandRepo.findByName(brand.getName());
        if(byName.isPresent()){
            throw new CustomException(HttpStatus.BAD_REQUEST, "There is another with the name " +brand.getName());
        }
        return brandRepo.save(brand);
    }

    public Brand editBrand(Integer id, Brand brand){
        Brand byId = brandRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Brand does not exist"));
        Optional<Brand> byName = brandRepo.findByName(brand.getName());
        if(byName.isPresent() && !byName.get().getId().equals(byId.getId())){
            throw new CustomException(HttpStatus.BAD_REQUEST, "There is another with the name " +brand.getName());
        }
        byId.setName(brand.getName());
        byId.setPhoto(brand.getPhoto());
        byId.setCategories(brand.getCategories());

        return brandRepo.save(byId);
    }

    public Brand deleteBrand(Integer id){
        Brand byId = brandRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Brand does not exist"));

        brandRepo.deleteById(id);
        return byId;
    }


}
