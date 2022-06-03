package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class BrandRepoTest {
    @Autowired
    private BrandRepo brandRepo;

    @Autowired
    private TestEntityManager entityManager;

    private List<Brand> brands = List.of(
            new Brand("Infinix"), new Brand("IPhones"),
            new Brand("Hp"), new Brand("Dell")
    );

    @Test
    void testAddBrand(){

        List<Brand> save = brandRepo.saveAll(brands);

        assertThat(save.size()).isGreaterThanOrEqualTo(brands.size());
    }

    @Test
    void testUpdateBrand(){
        Brand brand = entityManager.find(Brand.class, 5);
        brand.setName("Acer");

        Brand save = brandRepo.save(brand);
        assertThat(save).isNotNull();
        assertThat(save.getId()).isEqualTo(5);
    }

    @Test
    void testDeleteBrand(){
        Brand brand = entityManager.find(Brand.class, 3);
        brandRepo.delete(brand);
    }

    @Test
    void testListBrands(){
        List<Brand> brands = brandRepo.findAll();
        brands.forEach(System.out::println);
    }

}