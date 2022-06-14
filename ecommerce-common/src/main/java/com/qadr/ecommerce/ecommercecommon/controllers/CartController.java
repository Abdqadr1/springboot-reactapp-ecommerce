package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.ecommercecommon.service.CartService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired private CartService cartService;
    @Autowired private CustomerController customerController;

    @GetMapping("/view")
    public List<CartItem> getShoppingCartItems(){
        Customer customer = customerController.getCustomerDetails();
        return cartService.getItemsByCustomer(customer);
    }

    @PostMapping("/add")
    public Integer addItemToShoppingCart(HttpServletRequest request){
        String quantity = request.getParameter("quantity");
        String productId = request.getParameter("product_id");
        if(quantity == null || productId == null) throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid parameters");
        Integer number = Integer.valueOf(quantity), id = Integer.valueOf(productId);
        Customer customer = customerController.getCustomerDetails();
        return cartService.addItem(number, id, customer.getId());
    }
}
