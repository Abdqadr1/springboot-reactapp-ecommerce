package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.sharedLibrary.entities.Address;
import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.ecommercecommon.service.AddressService;
import com.qadr.ecommerce.ecommercecommon.service.CartService;
import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.ecommercecommon.service.ShippingRateService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.qadr.ecommerce.ecommercecommon.controllers.AddressController.getAddressFromCustomer;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired private CartService cartService;
    @Autowired private CustomerService customerService;
    @Autowired private AddressService addressService;
    @Autowired private ShippingRateService shippingRateService;


    public Customer getCustomerDetails(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return customerService.getByEmail(email)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "No user found with email " + email));
    }

    @GetMapping("/view")
    public Map<String, Object> getShoppingCartItems(){
        Customer customer = getCustomerDetails();
        Map<String, Object> result = new HashMap<>();
        List<CartItem> itemsByCustomer = cartService.getItemsByCustomer(customer);
        result.put("items", itemsByCustomer);

        Optional<Address> defaultAddress = addressService.findCustomerDefaultAddress(customer.getId());
        Address address = defaultAddress.orElseGet(() -> getAddressFromCustomer(customer));
        if(address.getState() == null) address.setState(address.getCity());

        Optional<ShippingRate> shippingRate = shippingRateService
                .findByCountryAndState(address.getCountry().getId(), address.getState());

        result.put("usePrimaryAddress", defaultAddress.isEmpty());
        result.put("addressSupported", shippingRate.isPresent());
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

    @DeleteMapping("/remove/{id}")
    public String removeItemInShoppingCart(@PathVariable("id") Integer id){
        Customer customer = getCustomerDetails();
        return cartService.removeByCustomerAndProduct(customer, id);
    }

}
