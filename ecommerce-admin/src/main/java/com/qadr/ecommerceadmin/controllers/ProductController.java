package com.qadr.ecommerceadmin.controllers;

import com.qadr.ecommerceadmin.model.*;
import com.qadr.ecommerceadmin.service.BrandService;
import com.qadr.ecommerceadmin.service.CategoryService;
import com.qadr.ecommerceadmin.service.ProductService;
import com.qadr.sharedLibrary.util.FileUploadUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Nullable;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.qadr.ecommerceadmin.service.BrandService.CATEGORY_PER_PAGE;

@RestController
@RequestMapping("/product")
public class ProductController {

    public static final Logger LOGGER = LoggerFactory.getLogger(ProductController.class);

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
    public Product addNewProduct (Product product,
                            @RequestParam("image") MultipartFile mainImage,
                           @RequestParam("detail_name") String[] names,
                           @RequestParam("detail_value") String[] values,
                            @RequestParam(value = "extra_image", required = false) MultipartFile[] extraImages) throws IOException {

        addProductDetails(names, values,  product);
        addMainImage(mainImage, product);
        addExtraImages(extraImages, product);

        Product savedProduct = productService.addProduct(product);
        saveImageFiles(mainImage, extraImages, savedProduct);

        return savedProduct;
    }

    @PostMapping("/edit/{id}")
    public Product editProduct(@PathVariable("id") Integer id, Product product,
                               @RequestParam(value = "main_image", required = false) MultipartFile mainImage,
                               @RequestParam("detail_name") String[] names,
                               @RequestParam("detail_value") String[] values,
                               @RequestParam(value = "saved_image", required = false) String[] saveImages,
                               @RequestParam(value = "extra_image", required = false) MultipartFile[] extraImages) throws IOException {

        addProductDetails(names, values, product);
        Optional.ofNullable(mainImage).ifPresent(file -> addMainImage(file,product));

        deleteRemovedImages(saveImages, product, id);
        Optional.ofNullable(extraImages).ifPresent(files -> addExtraImages(files, product));
        saveImageFiles(mainImage, extraImages, product);
        return productService.editProduct(id, product);
    }



    @GetMapping("/{id}/enable/{status}")
    public String updateEnabledStatus(@PathVariable("id") Integer id, @PathVariable("status") boolean status){
        return productService.setStatus(id, status);
    }

    @GetMapping("/delete/{id}")
    public Product deleteProduct(@PathVariable("id") Integer id){
        String folder = "product-images/"+id;
        FileUploadUtil.removeDir(folder);
        return productService.deleteProduct(id);
    }

    @GetMapping ("/brand-cat/{id}")
    public List<CategoryDTO> getBrandCategory(@PathVariable("id") Integer id){
        return brandService.getBrandCat(id);
    }

    void addProductDetails(String[] names, String[] values , Product product){
        for (int i = 0; i < names.length; i++) {
            String name = names[i];
            String value = values[i];
            if(name.isBlank() || value.isBlank()) continue;
            product.addDetail(name, value);
        }
    }
    void addMainImage(MultipartFile mainImage, Product product) {
        String filename = StringUtils.cleanPath(mainImage.getOriginalFilename());
        filename = filename.length() > 255 ? filename.substring(0, 254) : filename;
        product.setMainImage(filename);
    }
    void addExtraImages(MultipartFile[] files, Product product){
        if(files != null) {
            Arrays.stream(files)
                .forEach(file -> {
                    if(file != null){
                        String imageName = StringUtils.cleanPath(file.getOriginalFilename());
                        imageName = imageName.length() > 255 ? imageName.substring(0, 254) : imageName;
                        product.addImage(imageName);
                    }
                });
        }
    }
    void deleteRemovedImages(String[] data, Product product, int id){
        if(data != null) {
            List<String> paths = Arrays.stream(data)
                    .map(s -> {
                        String[] strings = s.split("<>", 2);
                        Integer i = Integer.valueOf(strings[0]);
                        String path = strings[1];
                        product.getExtraImages().add(new ProductImage(i, path, product));
                        return path;
                    }).collect(Collectors.toList());
            FileUploadUtil.removeFiles(paths, "product-images/"+id+"/extra-images");
        }
    }
    void saveImageFiles(@Nullable MultipartFile mainImage, @Nullable MultipartFile[] files, Product product) throws IOException {
        if(mainImage != null){
            String filename = StringUtils.cleanPath(mainImage.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254) : filename;
            product.setMainImage(filename);
            String uploadFolder = "product-images/"+product.getId()+"/main-image";
            FileUploadUtil.cleanDir(uploadFolder);
            FileUploadUtil.saveFile(mainImage, uploadFolder, filename);
        }

        if(files != null){
            // clean extra images directory
            String folder = "product-images/"+product.getId()+"/extra-images";
            Arrays.stream(files)
                .forEach(file -> {
                    if(file != null){
                        try {
                            String imageName = StringUtils.cleanPath(file.getOriginalFilename());
                            imageName = imageName.length() > 255 ? imageName.substring(0, 254) : imageName;
                            FileUploadUtil.saveFile(file, folder, imageName);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
        }

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
