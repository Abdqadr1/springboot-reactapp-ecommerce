package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.model.PayPalOrderResponse;
import com.qadr.ecommerce.sharedLibrary.entities.Address;
import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.ecommercecommon.model.CheckoutInfo;
import com.qadr.ecommerce.ecommercecommon.service.*;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.entities.order.PaymentMethod;
import com.qadr.ecommerce.sharedLibrary.entities.setting.CurrencySettingBag;
import com.qadr.ecommerce.sharedLibrary.entities.setting.PaymentSettingBag;
import com.qadr.ecommerce.sharedLibrary.entities.setting.Setting;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.qadr.ecommerce.ecommercecommon.controllers.AddressController.getAddressFromCustomer;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    @Autowired private CheckoutService checkoutService;
    @Autowired private AddressService addressService;
    @Autowired private CartService cartService;
    @Autowired private CustomerService customerService;
    @Autowired private ShippingRateService shippingRateService;
    @Autowired private OrderService orderService;
    @Autowired private SettingsService settingsService;
    @Autowired private PayPalService payPalService;
    @Autowired private ControllerHelper controllerHelper;

    @GetMapping
    public Map<String, Object> checkout(){
        Customer customer = controllerHelper.getCustomerDetails();
        Map<String, Object> result = new HashMap<>();
        List<CartItem> cartItems = cartService.getItemsByCustomer(customer);

        Optional<Address> defaultAddress = addressService.findCustomerDefaultAddress(customer.getId());
        Address address = defaultAddress.orElseGet(()-> getAddressFromCustomer(customer));
        if(address.getState() == null) address.setState(address.getCity());

        ShippingRate shippingRate = shippingRateService
                .findByCountryAndState(address.getCountry().getId(), address.getState())
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST,"No shipping available for your location"));

        CheckoutInfo checkoutInfo = checkoutService.prepareCheckout(cartItems, shippingRate);
        PaymentSettingBag paymentSettings = settingsService.getPaymentSettingBag();

        result.put("info", checkoutInfo);
        result.put("items", cartItems);
        result.put("address", address.toString());
        result.put("paymentId", paymentSettings.getPaymentId());
        customer.setPassword("");
        result.put("customer", customer);
        result.put("currency", settingsService.getCurrency());
        return result;
    }

    @PostMapping("/place_order")
    public String placeOrder(HttpServletRequest request){
        String cod = request.getParameter("paymentMethod");
        if(cod == null) throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid parameters");
        PaymentMethod paymentMethod = PaymentMethod.valueOf(cod);

        Customer customer = controllerHelper.getCustomerDetails();
        List<CartItem> cartItems = cartService.getItemsByCustomer(customer);

        Optional<Address> defaultAddress = addressService.findCustomerDefaultAddress(customer.getId());
        Address address = defaultAddress.orElseGet(()-> getAddressFromCustomer(customer));
        if(address.getState() == null) address.setState(address.getCity());

        ShippingRate shippingRate = shippingRateService
                .findByCountryAndState(address.getCountry().getId(), address.getState())
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST,"No shipping available for your location"));

        CheckoutInfo checkoutInfo = checkoutService.prepareCheckout(cartItems, shippingRate);
        Order order = orderService.createOrder(customer, cartItems, checkoutInfo, address, paymentMethod);

        return "Order successfully placed";
    }

    @PostMapping("/paypal_order")
    public String processPayPalOrder(HttpServletRequest request){
        String orderId = request.getParameter("orderId");
        if(orderId == null) throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid parameters");
        PayPalOrderResponse payPalResponse = payPalService.getOrderDetails(orderId);
        if(!payPalResponse.validate(orderId))
            throw new CustomException(HttpStatus.BAD_REQUEST, "Payment could not be confirmed");

        PaymentMethod paymentMethod = PaymentMethod.PAYPAL;

        Customer customer = controllerHelper.getCustomerDetails();
        List<CartItem> cartItems = cartService.getItemsByCustomer(customer);

        Optional<Address> defaultAddress = addressService.findCustomerDefaultAddress(customer.getId());
        Address address = defaultAddress.orElseGet(()-> getAddressFromCustomer(customer));
        if(address.getState() == null) address.setState(address.getCity());

        ShippingRate shippingRate = shippingRateService
                .findByCountryAndState(address.getCountry().getId(), address.getState())
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST,"No shipping available for your location"));

        CheckoutInfo checkoutInfo = checkoutService.prepareCheckout(cartItems, shippingRate);
        Order order = orderService.createOrder(customer, cartItems, checkoutInfo, address, paymentMethod);

        return "Order successfully placed";
    }
}
