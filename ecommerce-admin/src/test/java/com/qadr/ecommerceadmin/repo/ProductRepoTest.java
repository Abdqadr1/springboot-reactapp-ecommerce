package com.qadr.ecommerceadmin.repo;

import com.qadr.ecommerceadmin.model.Brand;
import com.qadr.ecommerceadmin.model.Category;
import com.qadr.ecommerceadmin.model.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.util.Date;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class ProductRepoTest {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void testCreateDell(){
        Category laptopCategory = entityManager.find(Category.class, 18);
        Brand dellBrand = entityManager.find(Brand.class, 6);
        Product product = new Product();
        product.setName("Dell Inspironi");
        product.setAlias("Dell Inspironi 85");
        product.setShortDescription("This is a rugged system");
        product.setFullDescription("Everything about this system is portable");
        product.setCreatedTime(new Date());
        product.setUpdatedTime(new Date());
        product.setCategory(laptopCategory);
        product.setBrand(dellBrand);
        product.setPrice(300);

        Product save = productRepo.save(product);
        assertThat(save).isNotNull();
        assertThat(save.getId()).isGreaterThan(0);
    }

    @Test
    void testCreateIphone(){
        Category smartPhones = entityManager.find(Category.class, 31);
        Brand iphoneBrand = entityManager.find(Brand.class, 4);
        Product product = new Product();
        product.setName("Iphone X");
        product.setAlias("Iphone X 64gb");
        product.setShortDescription("This is Iphone X with 64gb RAM");
        product.setFullDescription("Iphone X");
        product.setCreatedTime(new Date());
        product.setUpdatedTime(new Date());
        product.setCategory(smartPhones);
        product.setBrand(iphoneBrand);
        product.setPrice(350);

        Product save = productRepo.save(product);
        assertThat(save).isNotNull();
        assertThat(save.getId()).isGreaterThan(0);
    }

    @Test
    void testUpdateProduct(){
        int id = 2;
        Product product = productRepo.findById(id).get();
        assertThat(product).isNotNull();
        product.setFullDescription("This is an amazing phone for taking pictures, its sleek.");
        product.setUpdatedTime(new Date());
        Product save = productRepo.save(product);
        assertThat(save.getId()).isEqualTo(id);

    }

    @Test
    void testDeleteProduct(){
        int id = 4;
//        productRepo.deleteById(id);
        boolean empty = productRepo.findById(id).isEmpty();
        assertThat(empty).isTrue();
    }

    @Test
    void testListProducts(){
        productRepo.findAll().forEach(System.out::println);
    }
}