package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
class CartItemRepoTest {
    @Autowired private CartItemRepo cartItemRepo;
    @Autowired private TestEntityManager entityManager;

    @Test
    void testAdd(){
        List<CartItem> cartItems = List.of(new CartItem(1, new Customer(1), new Product(1)),
                new CartItem(2, new Customer(10), new Product(2)),
                new CartItem(3, new Customer(4), new Product(6))
        );
        CartItem item = cartItemRepo.save(new CartItem(2, new Customer(7), new Product(8)));
        assertThat(item).isNotNull();
    }

    @Test
    void testAddCartItem(){
        List<CartItem> cartItems = List.of(new CartItem(1, new Customer(1), new Product(1)),
                new CartItem(2, new Customer(10), new Product(2)),
                new CartItem(3, new Customer(4), new Product(6))
        );
        List<CartItem> items = cartItemRepo.saveAll(cartItems);
        assertThat(items.size()).isEqualTo(cartItems.size());
    }

    @Test
    void testFindByCustomer(){
        List<CartItem> byCustomer = cartItemRepo.findByCustomer(new Customer(1));
        byCustomer.forEach(System.out::println);
        assertThat(byCustomer.size()).isGreaterThan(0);
    }
    
    @Test
    void testFindCustomerAndProduct(){
        Optional<CartItem> byCustomer = cartItemRepo.findByCustomerAndProduct(new Customer(10), new Product(2));
        assertThat(byCustomer).isPresent();
        System.out.println(byCustomer.get());
    }

    @Test
    void testUpdateQuantity(){
        cartItemRepo.updateQuantity(5, 10, 2);
    }

    @Test
    void testDeleteCartItem(){
        int customerId = 10, productId = 2;
        cartItemRepo.deleteByCustomerAndProduct(customerId, productId);
        Optional<CartItem> byCustomer = cartItemRepo.findByCustomerAndProduct(new Customer(customerId), new Product(productId));
        assertThat(byCustomer).isNotPresent();
    }
}