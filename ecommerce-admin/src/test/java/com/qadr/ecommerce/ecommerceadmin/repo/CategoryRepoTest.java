package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.Collection;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class CategoryRepoTest {

    @Autowired
    private CategoryRepo categoryRepo;

    List<Category> parents = List.of(new Category("Computers"),
            new Category("Electronics"), new Category("Furniture"));

    @Test
    void testSaveCategory(){
        List<Category> categories = categoryRepo.saveAll(parents);

        assertThat(categories.size()).isGreaterThan(0);
    }

    @Test
    void testAddSubCategory(){
        List<Category> subs = List.of(new Category("Laptops", new Category(1)),
                new Category("Desktops", new Category(1)),
                new Category("Computer Components", new Category(1)),

                new Category("Tvs", new Category(2)),
                new Category("Mobiles", new Category(2)),

                new Category("Tables", new Category(3)),
                new Category("Chairs", new Category(3)));

        List<Category> categories = categoryRepo.saveAll(subs);

        assertThat(categories.size()).isGreaterThan(0);
    }

    @Test
    void addSubLevel(){
        List<Category> subs = List.of(new Category("iPhones", new Category(22)),
                new Category("Android", new Category(22)),
                new Category("Smart Tvs", new Category(21)));

        List<Category> categories = categoryRepo.saveAll(subs);

        assertThat(categories.size()).isGreaterThan(0);
    }

    @Test
    void printCategories(){
        categoryRepo.findAll().stream()
            .filter(category -> category.getParent() == null)
            .forEach(category -> {
                System.out.println(category.getName());
                if(!category.getChildren().isEmpty()) printSub(category.getChildren(), 2);
            });
    }

    void printSub(Collection<Category> children, Integer dashes){
        StringBuilder prefix = new StringBuilder();
        prefix.append("-".repeat(Math.max(0, dashes)));
        children.forEach(category -> {
            System.out.println(prefix+category.getName());
            if(!category.getChildren().isEmpty()) printSub(category.getChildren(), dashes+2);
        });
    }

    @Test
    void testUpdateStatus(){
        categoryRepo.updateStatus(20, true);
    }
}