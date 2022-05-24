package com.qadr.ecommerceadmin.controllers;

import com.qadr.ecommerceadmin.model.Brand;
import com.qadr.ecommerceadmin.model.CategoryDTO;
import com.qadr.ecommerceadmin.model.Product;
import com.qadr.ecommerceadmin.service.BrandService;
import com.qadr.ecommerceadmin.service.CategoryService;
import com.qadr.ecommerceadmin.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.qadr.ecommerceadmin.service.BrandService.CATEGORY_PER_PAGE;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private BrandService brandService;


    @GetMapping
    public CustomProductPage listFirstPage(){
        return listByPage(1, "name", "asc", null);
    }


    @GetMapping("/page/{number}")
    public CustomProductPage listByPage(@PathVariable("number") Integer number,
                                      @RequestParam("sortField") String sortField,
                                      @RequestParam("dir") String dir,
                                      @RequestParam(value = "keyword", required = false) String keyword){

        Page<Product> page = productService.getPage(number, sortField, dir, keyword);
        int startCount = (number-1) * CATEGORY_PER_PAGE + 1;
        int endCount = CATEGORY_PER_PAGE * number;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;


        return new CustomProductPage(
                number, startCount, endCount, page.getTotalPages(),
                page.getTotalElements(), page.getContent(),
                CategoryService.CATEGORY_PER_PAGE, brandService.getAll()
        );
    }

    @PostMapping(value = "/add")
    public Product addNewUser (@RequestBody Product product) {
        return productService.addProduct(product);
    }



    @GetMapping("/{id}/enable/{status}")
    public String updateEnabledStatus(@PathVariable("id") Integer id, @PathVariable("status") boolean status){
        return productService.setStatus(id, status);
    }

    @GetMapping("/delete/{id}")
    public Product deleteProduct(@PathVariable("id") Integer id){
        return productService.deleteProduct(id);
    }

    @GetMapping ("/brand-cat/{id}")
    public List<CategoryDTO> getBrandCategory(@PathVariable("id") Integer id){
        return brandService.getBrandCat(id);
    }

}
@AllArgsConstructor
@Data
class CustomProductPage {
    Integer currentPage;
    Integer startCount;
    Integer endCount;
    Integer totalPages;
    Long totalElements;
    List<Product> products;
    Integer numberPerPage;
    List<Brand> brands;
}
