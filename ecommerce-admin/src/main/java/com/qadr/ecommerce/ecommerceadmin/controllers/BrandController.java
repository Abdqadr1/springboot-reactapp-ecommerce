package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.export.BrandCsvExport;
import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import com.qadr.ecommerce.ecommerceadmin.service.BrandService;
import com.qadr.ecommerce.ecommerceadmin.service.CategoryService;
import com.qadr.ecommerce.sharedLibrary.util.FileUploadUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static com.qadr.ecommerce.ecommerceadmin.service.BrandService.CATEGORY_PER_PAGE;

@RestController
@RequestMapping("/brand")
public class BrandController {
    @Autowired
    private BrandService brandService;

    @GetMapping
    public CustomBrandPage listFirstPage(){
        return listByPage(1, "name", "asc", null);
    }

    @GetMapping("/page/{number}")
    public CustomBrandPage listByPage(@PathVariable("number") Integer number,
                                         @RequestParam("sortField") String sortField,
                                         @RequestParam("dir") String dir,
                                         @RequestParam(value = "keyword", required = false) String keyword){

        Page<Brand> page = brandService.getPage(number, sortField, dir, keyword);
        int startCount = (number-1) * CATEGORY_PER_PAGE + 1;
        int endCount = CATEGORY_PER_PAGE * number;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;


        return new CustomBrandPage(
                number, startCount, endCount, page.getTotalPages(),
                page.getTotalElements(), page.getContent(), CategoryService.CATEGORY_PER_PAGE
        );
    }
//
//    @GetMapping("/get-hierarchy")
//    public List<Brand> getHierarchy(){
//        return brandService.getHierarchy();
//    }

    @PostMapping("/add")
    public Brand addBrand(Brand brand,
                                @RequestParam(value = "image", required = false)MultipartFile file) throws IOException {
        if(Optional.ofNullable(file).isPresent()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254) : filename;
            brand.setPhoto(filename);
            Brand addBrand = brandService.addBrand(brand);
            String uploadFolder = "brand-photos/"+addBrand.getId();
            FileUploadUtil.saveFile(file, uploadFolder, filename);
            return addBrand;
        }
        return brandService.addBrand(brand);
    }

    @PostMapping("/edit/{id}")
    public Brand editBrand(Brand brand,
                                 @PathVariable("id") Integer id,
                                 @RequestParam(value = "image", required = false)MultipartFile file) throws IOException {
        if(Optional.ofNullable(file).isPresent()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254) : filename;
            brand.setPhoto(filename);
            Brand savedBrand = brandService.editBrand(id, brand);
            String uploadFolder = "brand-photos/"+savedBrand.getId();
            FileUploadUtil.saveFile(file, uploadFolder, filename);
            return savedBrand;
        }
        return brandService.editBrand(id, brand);
    }

    @GetMapping("/delete/{id}")
    public Brand deleteBrand(@PathVariable("id") Integer id){
        return brandService.deleteBrand(id);
    }

    @GetMapping("/export/csv")
    void exportCSV(HttpServletResponse response) throws IOException {
        List<Brand> brands = brandService.getAll();
        BrandCsvExport brandCsvExport = new BrandCsvExport();
        brandCsvExport.export(brands, response);
    }
}

@AllArgsConstructor
@Data
class CustomBrandPage {
    Integer currentPage;
    Integer startCount;
    Integer endCount;
    Integer totalPages;
    Long totalElements;
    List<Brand> brands;
    Integer numberPerPage;
}