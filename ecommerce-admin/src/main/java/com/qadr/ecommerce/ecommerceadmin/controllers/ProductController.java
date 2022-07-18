package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.model.CategoryDTO;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.entities.product.ProductImage;
import com.qadr.ecommerce.ecommerceadmin.service.BrandService;
import com.qadr.ecommerce.ecommerceadmin.service.ProductService;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import com.qadr.ecommerce.sharedLibrary.util.AmazonS3Util;
import com.qadr.ecommerce.sharedLibrary.util.FileUploadUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Nullable;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.qadr.ecommerce.sharedLibrary.entities.Constants.PRODUCT_IMAGE_FOLDER_NAME;
import static com.qadr.ecommerce.sharedLibrary.entities.Constants.USER_IMAGE_FOLDER_NAME;


@RestController
@RequestMapping("/product")
public class ProductController {

    public static final Logger LOGGER = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @Autowired
    private BrandService brandService;


    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("products")PagingAndSortingHelper helper){

        Map<String, Object> pageInfo= productService.searchProducts(number, helper);
        pageInfo.put("brands", brandService.getAll());
        return pageInfo;
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

        System.out.println(id);
        product.setId(id);
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
        String folder = PRODUCT_IMAGE_FOLDER_NAME+"/"+id;
        AmazonS3Util.removeFolder(folder);
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
            removeFiles(paths, PRODUCT_IMAGE_FOLDER_NAME+"/"+id+"/extras");
        }
    }
    private static void removeFiles(List<String> filenames, String dir){
        List<String> keys = AmazonS3Util.listFolderKey(dir);
        keys.stream()
                .filter(key -> !filenames.contains(key.substring(key.lastIndexOf("/")+1)))
                .forEach(AmazonS3Util::deleteFile);
    }
    void saveImageFiles(@Nullable MultipartFile mainImage, @Nullable MultipartFile[] files, Product product)
            throws IOException {

        if(mainImage != null){
            String filename = StringUtils.cleanPath(mainImage.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254) : filename;
            product.setMainImage(filename);
            String uploadFolder = PRODUCT_IMAGE_FOLDER_NAME+"/"+product.getId();
            AmazonS3Util.listFolderKey(uploadFolder)
                    .stream().filter(s -> !s.contains("/extras/")).forEach(AmazonS3Util::deleteFile);
            AmazonS3Util.uploadFile(uploadFolder, filename, mainImage.getInputStream());
        }

        if(files != null){
            // clean extra images directory
            String folder = "product-images/"+product.getId()+"/extras";
            Arrays.stream(files)
                .forEach(file -> {
                    if(file != null){
                        try {
                            String imageName = StringUtils.cleanPath(file.getOriginalFilename());
                            imageName = imageName.length() > 255 ? imageName.substring(0, 254) : imageName;
                            AmazonS3Util.uploadFile(folder, imageName, file.getInputStream());
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
        }

    }

}
