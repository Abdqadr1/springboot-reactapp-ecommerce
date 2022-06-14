package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.ecommercecommon.repo.CartItemRepo;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired private CartItemRepo cartItemRepo;
    @Autowired private ProductRepo productRepo;

    @Transactional
    public Integer addItem(Integer number, Integer productId, Integer customerId) {
        productRepo.findById(productId)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "This product does not exist"));
        Product product = new Product(productId);
        Customer customer = new Customer(customerId);
        Optional<CartItem> byCustomerAndProduct = cartItemRepo.findByCustomerAndProduct(customer, product);
        CartItem cartItem;
        if(byCustomerAndProduct.isPresent()){
            cartItem = byCustomerAndProduct.get();
            number = number + cartItem.getQuantity();
        }else {
            cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setCustomer(customer);
        }
        cartItem.setQuantity(number);
        cartItemRepo.save(cartItem);
        return number;
    }

    public List<CartItem> getItemsByCustomer(Customer customer) {
        return cartItemRepo.findByCustomer(customer);
    }
}
