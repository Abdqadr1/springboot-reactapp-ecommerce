package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.Storefront;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StorefrontModel;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StorefrontType;
import com.qadr.ecommerce.sharedLibrary.repo.StorefrontRepo;
import com.qadr.ecommerce.sharedLibrary.repo.StorefrontModelRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
public class StorefrontRepoTest {
    @Autowired private StorefrontRepo repo;
    @Autowired private StorefrontModelRepo modelRepo;
    @Autowired TestEntityManager entityManager;

    @Test
    void testAdd(){
        Brand brand = entityManager.find(Brand.class, 8);
        Brand brand1 = entityManager.find(Brand.class, 11);
        StorefrontModel model = new StorefrontModel();
        model.setBrand(brand);
        model.setPosition(1);
        model.setType(StorefrontType.BRAND);


        StorefrontModel model1 = new StorefrontModel();
        model1.setBrand(brand1);
        model1.setPosition(2);
        model1.setType(StorefrontType.BRAND);

        Storefront storeFront = new Storefront();
        storeFront.setType(StorefrontType.BRAND);
        storeFront.setHeading("Favorite Brands");
        storeFront.setDescription("Current hot brands");
        storeFront.setPosition(8);
        storeFront.setEnabled(true);
        storeFront.addModel(model);
        storeFront.addModel(model1);
        Storefront save = repo.save(storeFront);
        assertThat(save).isNotNull();
        System.out.println(save);
    }

    @Test
    void testFindModelByPositionAndType(){
        Storefront storefront = new Storefront(12);
        Optional<StorefrontModel> model = modelRepo.findByStorefrontAndPosition(storefront, 3);
        assertThat(model).isPresent();
        System.out.println(model.get());
    }


    @Test
    void testUpdateStorefront(){
        int id = 12;
        Optional<Storefront> byId = repo.findById(id);
        assertThat(byId).isPresent();
        assertThat(byId.get().getModels().size()).isEqualTo(2);
        Brand brand = entityManager.find(Brand.class, 15);
        StorefrontModel model = new StorefrontModel();
        model.setBrand(brand);
        model.setPosition(3);
        model.setType(StorefrontType.BRAND);
        Storefront storefront = byId.get();
        storefront.addModel(model);
        repo.save(storefront);
    }

    @Test
    void testRemoveModel(){
        int id = 12;
        Optional<Storefront> byId = repo.findById(id);
        assertThat(byId).isPresent();
        Storefront storefront = byId.get();
        Set<StorefrontModel> collect = storefront.getModels().stream()
                .filter(model -> model.getType() != null)
                .collect(Collectors.toSet());
        storefront.setModels(collect);
        repo.save(storefront);
    }


    @Test
    void testAddStoreFront(){
        Storefront storeFront = new Storefront();
        storeFront.setType(StorefrontType.BRAND);
        storeFront.setHeading("Featured Brands");
        storeFront.setDescription("best selling brands");
        storeFront.setPosition(2);
        storeFront.setEnabled(true);
        Storefront save = repo.save(storeFront);
        assertThat(save).isNotNull();
        System.out.println(save);
    }
    @Test
    void testFindById(){
        int id = 6;
        Optional<Storefront> byId = repo.findById(id);
        assertThat(byId).isPresent();
        System.out.println(byId.get());
    }

    @Test
    void testFindByType(){
        List<Storefront> byType = repo.findByType(StorefrontType.ALL_CATEGORIES);
        assertThat(byType.size()).isGreaterThan(0);
        System.out.println(byType);
    }

    @Test
    void testFindByEnabled(){
        List<Storefront> byType = repo.findByEnabled(true);
        assertThat(byType.size()).isGreaterThan(0);
        System.out.println(byType);
    }

    @Test
    void testUpdateEnabled(){
        int id = 1;
        repo.updateEnabled(id, true);
    }

    @Test
    void testFindMaxPosition(){
        int maxPosition = repo.findMaxPosition();
        assertThat(maxPosition).isEqualTo(2);
    }

    @Test
    void testDeleteById(){
        int id = 13;
        repo.deleteById(id);
        Optional<Storefront> byId = repo.findById(id);
        assertThat(byId).isNotPresent();
    }

    @Test
    void testFindByPosition(){
        int position = 1;
        Optional<Storefront> byPosition = repo.findByPosition(position);
        assertThat(byPosition).isPresent();
        System.out.println(byPosition.get());
    }
}
