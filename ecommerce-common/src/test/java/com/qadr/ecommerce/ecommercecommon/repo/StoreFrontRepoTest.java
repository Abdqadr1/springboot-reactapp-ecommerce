package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFront;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFrontType;
import com.qadr.ecommerce.sharedLibrary.repo.StoreFrontRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
public class StoreFrontRepoTest {
    @Autowired private StoreFrontRepo repo;
    @Autowired TestEntityManager entityManager;

    @Test
    void testAddStoreFront(){
        Brand brand = entityManager.find(Brand.class, 1);
        StoreFront storeFront = new StoreFront();
        storeFront.setType(StoreFrontType.BRAND);
        storeFront.setHeading("Featured Brands");
        storeFront.setDescription("best selling brands");
        storeFront.setPosition(2);
        storeFront.setEnabled(true);
        StoreFront save = repo.save(storeFront);
        brand.setStoreFront(save);
        assertThat(save).isNotNull();
        System.out.println(save);
    }
    @Test
    void testFindById(){
        int id = 6;
        Optional<StoreFront> byId = repo.findById(id);
        assertThat(byId).isPresent();
        System.out.println(byId.get());
        System.out.println(byId.get().getBrandsList());
    }

    @Test
    void testFindByType(){
        List<StoreFront> byType = repo.findByType(StoreFrontType.ALL_CATEGORIES);
        assertThat(byType.size()).isGreaterThan(0);
        System.out.println(byType);
    }

    @Test
    void testFindByEnabled(){
        List<StoreFront> byType = repo.findByEnabled(true);
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
        int id = 3;
        repo.deleteById(id);
        Optional<StoreFront> byId = repo.findById(id);
        assertThat(byId).isNotPresent();
    }

    @Test
    void testFindByPosition(){
        int position = 1;
        Optional<StoreFront> byPosition = repo.findByPosition(position);
        assertThat(byPosition).isPresent();
        System.out.println(byPosition.get());
    }
}
