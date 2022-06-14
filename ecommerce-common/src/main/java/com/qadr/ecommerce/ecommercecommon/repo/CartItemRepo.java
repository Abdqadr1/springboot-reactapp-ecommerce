package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CartItemRepo extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCustomer(Customer customer);

    Optional<CartItem> findByCustomerAndProduct(Customer customer, Product product);

    @Modifying
    @Query("UPDATE CartItem c SET c.quantity=?1 WHERE c.customer.id=?2 AND c.product.id=?3")
    void updateQuantity(Integer quantity, Integer customerId, Integer productId);


    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.customer.id=?1 AND c.product.id=?2")
    void deleteByCustomerAndProduct(Integer customerId, Integer productId);
}
