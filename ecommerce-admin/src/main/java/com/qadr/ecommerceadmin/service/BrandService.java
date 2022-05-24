package com.qadr.ecommerceadmin.service;

import com.qadr.ecommerceadmin.errors.CustomException;
import com.qadr.ecommerceadmin.model.Brand;
import com.qadr.ecommerceadmin.model.CategoryDTO;
import com.qadr.ecommerceadmin.repo.BrandRepo;
import com.qadr.ecommerceadmin.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BrandService {

    public static final int CATEGORY_PER_PAGE = 5;

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

    public Page<Brand> getPage(int pageNumber, String field, String dir, String keyword){
        Sort sort = Sort.by(field);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(pageNumber - 1, CATEGORY_PER_PAGE, sort);

        if(keyword != null && !keyword.isBlank()){
            return brandRepo.searchKeyword(keyword, pageable);
        }

        return brandRepo.findAll(pageable);
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
