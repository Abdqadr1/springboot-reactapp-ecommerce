package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.ecommercecommon.service.CartService;
import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired private CartService cartService;
    @Autowired private CustomerService customerService;


    public Customer getCustomerDetails(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = customerService.getByEmail(email)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "No user found with email " + email));
        return customer;
    }

    @GetMapping("/view")
    public Map<String, Object> getShoppingCartItems(){
        Customer customer = getCustomerDetails();
        List<CartItem> items = cartService.getItemsByCustomer(customer);
        Map<String, Object> result = new HashMap<>();
        float total = 0.0F;
        for(CartItem item : items){
            total += item.getSubTotal();
        }

        result.put("items", items);
        result.put("total", total);
        return result;
    }

    @PostMapping("/add")
    public Integer addItemToShoppingCart(HttpServletRequest request){
        String quantity = request.getParameter("quantity");
        String productId = request.getParameter("product_id");
        if(quantity == null || productId == null) throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid parameters");
        Integer number = Integer.valueOf(quantity), id = Integer.valueOf(productId);
        Customer customer = getCustomerDetails();
        return cartService.addItem(number, id, customer);
    }

    @PostMapping("/update")
    public Float updateItemInShoppingCart(HttpServletRequest request){
        String number = request.getParameter("quantity");
        String string = request.getParameter("product_id");
        if(number == null || string == null) throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid parameters");
        Integer quantity = Integer.valueOf(number), productId = Integer.valueOf(string);
        Customer customer = getCustomerDetails();
        return cartService.updateItem(quantity, productId, customer);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteItemInShoppingCart(@PathVariable("id") Integer id){
        return cartService.deleteById(id);
    }

}
