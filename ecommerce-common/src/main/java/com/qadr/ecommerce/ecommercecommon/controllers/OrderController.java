package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.ecommercecommon.service.OrderService;
import com.qadr.ecommerce.ecommercecommon.service.ReviewService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderTrack;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired private OrderService orderService;
    @Autowired private CustomerService customerService;
    @Autowired private ReviewService reviewService;
    @Autowired private ControllerHelper controllerHelper;

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("orders") PagingAndSortingHelper helper){
        Customer customer = controllerHelper.getCustomerDetails();
        Map<String, Object> page = orderService.getPage(number, customer, helper);
        List<Order> orders = (List<Order>) page.get("orders");
        orders.forEach(order -> setReviewableStatus(customer, order));
        return page;
    }

    public void setReviewableStatus(Customer customer, Order order){
        Set<OrderDetail> orderDetails = order.getOrderDetails();
        orderDetails.forEach(detail -> {
            Product product = detail.getProduct();
            product.setCustomerCanReview(
                    reviewService.canCustomerReviewProduct(product.getId(),customer.getId())
            );
            product.setReviewedByCustomer(
                    reviewService.didCustomerReviewProduct(product.getId(), customer.getId()));
        });

    }

    @PostMapping("/request_return/{id}")
    public OrderTrack requestReturn(@PathVariable("id") Integer id, HttpServletRequest request){
        String reason = request.getParameter("reason");
        String note = request.getParameter("note");
        if(reason == null || reason.isBlank())
            throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid parameters");
        Customer customer = controllerHelper.getCustomerDetails();
        return orderService.requestReturn(customer, id, reason, note);
    }

}
