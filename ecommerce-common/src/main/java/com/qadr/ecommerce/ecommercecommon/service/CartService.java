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
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired private CartItemRepo cartItemRepo;
    @Autowired private ProductRepo productRepo;

    @Transactional
    public Integer addItem(Integer number, Integer productId, Customer customer) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "This product does not exist"));
        Optional<CartItem> byCustomerAndProduct = cartItemRepo.findByCustomerAndProduct(customer, product);
        CartItem cartItem;
        if(byCustomerAndProduct.isPresent()){
            cartItem = byCustomerAndProduct.get();
            number = number + cartItem.getQuantity();
        }else {
            cartItem = new CartItem(customer, product);
        }
        if(number > 5 || number < 1)
            throw new CustomException(HttpStatus.BAD_REQUEST, "You can't buy less than 1 or more than 5 of this item");

        cartItem.setQuantity(number);
        cartItemRepo.save(cartItem);
        return number;
    }

    public List<CartItem> getItemsByCustomer(Customer customer) {
        return cartItemRepo.findByCustomer(customer);
    }

    public void addNewItem(Integer number, Customer customer, Product product){
    }

    @Transactional
    public Float updateItem(Integer quantity, Integer productId, Customer customer) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "This product does not exist"));
        cartItemRepo.updateQuantity(quantity, customer.getId(), product.getId());
        Optional<CartItem> byCustomerAndProduct = cartItemRepo.findByCustomerAndProduct(customer, product);
        return byCustomerAndProduct.map(CartItem::getSubTotal).get();
    }

    public String deleteById(Integer id) {
        cartItemRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "This item no longer exist in your cart"));
        cartItemRepo.deleteById(id);
        return "Item deleted";
    }
}
