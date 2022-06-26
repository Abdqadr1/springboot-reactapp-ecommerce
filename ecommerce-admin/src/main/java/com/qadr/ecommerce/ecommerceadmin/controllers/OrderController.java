package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.OrderService;
import com.qadr.ecommerce.ecommerceadmin.service.ProductService;
import com.qadr.ecommerce.sharedLibrary.entities.order.*;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import com.qadr.ecommerce.sharedLibrary.repo.OrderRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/orders")
public class OrderController {
    public static final Logger LOGGER = LoggerFactory.getLogger(OrderController.class);
    @Autowired private OrderService orderService;
    @Autowired private ProductService productService;

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("orders") PagingAndSortingHelper helper){

        Map<String, Object> results = new HashMap<>();
        if(hasOnlyRole("Shipper")){
            results.putAll(orderService.getShipperPage(number, helper)); ;
        }else {
            results.put("paymentMethods", PaymentMethod.values());
            results.putAll(orderService.getPage(number, helper));
        }
        Map<String, String > notes = new HashMap<>();
        Arrays.stream(OrderStatus.values())
                .forEach(orderStatus -> notes.put(orderStatus.name(), orderStatus.getDescription()));
        results.put("notes", notes);
        return results;
    }

    @PostMapping("/product_search/page/{number}")
    public Map<String, Object> listProductByPage(@PathVariable("number") Integer number,
                                                 @PagingAndSortingParam("products") PagingAndSortingHelper helper){
        return productService.searchProducts(number, helper);
    }

    @PostMapping("/update_status/{id}/{status}")
    public Map<String, Object> shipperUpdateStatus(@PathVariable("id") Integer id,
                                                   @PathVariable("status") String status){
        return orderService.updateStatus(id, status);
    }

    @PostMapping("/edit")
    public Order editCustomer(Order order, HttpServletRequest request){
        updateOrderDetails(order, request);
        updateOrderTracks(order, request);

        return orderService.editOrder(order);
    }

    private void updateOrderDetails(Order order, HttpServletRequest request) {
        String[] ids = request.getParameterValues("_detail_id");
        String[] quantities = request.getParameterValues("_detail_quantity");
        String[] shippingCosts = request.getParameterValues("_detail_shippingCost");
        String[] productCosts = request.getParameterValues("_detail_productCost");
        String[] subtotals = request.getParameterValues("_detail_subtotal");
        String[] unitPrices = request.getParameterValues("_detail_unitPrice");
        String[] products = request.getParameterValues("_detail_product");
        for (int i = 0; i < products.length; i++) {
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            Integer id = ids[i].isBlank() ? null :Integer.valueOf(ids[i]);
            detail.setId(id);
            detail.setQuantity(Integer.parseInt(quantities[i]));
            detail.setShippingCost(Float.parseFloat(shippingCosts[i]));
            detail.setProductCost(Float.parseFloat(productCosts[i]));
            detail.setProduct(new Product(Integer.valueOf(products[i])));
            detail.setSubtotal(Float.parseFloat(subtotals[i]));
            detail.setUnitPrice(Float.parseFloat(unitPrices[i]));
            order.getOrderDetails().add(detail);
        }
    }
    private void updateOrderTracks(Order order, HttpServletRequest request) {
        String[] ids = request.getParameterValues("_track_id");
        String[] trackNotes = request.getParameterValues("_track_note");
        String[] updatedTimes = request.getParameterValues("_track_timeInForm");
        String[] statuses = request.getParameterValues("_track_status");
        for (int i = 0; i < statuses.length; i++) {
            OrderTrack track = new OrderTrack();
            track.setOrder(order);
            Integer id = ids[i].isBlank() ? null :Integer.valueOf(ids[i]);
            track.setId(id);
            track.setNote(trackNotes[i]);
            track.setStatus(OrderStatus.valueOf(statuses[i]));
            track.setUpdatedTime(getDateFromString(updatedTimes[i]));
            order.getOrderTracks().add(track);
        }
    }

    private Date getDateFromString(String dateString){
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm");
        try {
            return dateFormatter.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
            throw new CustomException(HttpStatus.BAD_REQUEST, "Could not parse dateString");
        }
    }

    @GetMapping("/delete/{id}")
    public Order deleteCustomer(@PathVariable("id") Integer id){
        return orderService.deleteOrder(id);
    }

    public boolean hasOnlyRole(String role){
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities();
        if(authorities.size() > 1) return  false;
        return authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(role));
    }

}
