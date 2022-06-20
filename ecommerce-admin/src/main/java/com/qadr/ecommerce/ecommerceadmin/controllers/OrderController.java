package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.OrderService;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {
    public static final Logger LOGGER = LoggerFactory.getLogger(OrderController.class);
    @Autowired private OrderService orderService;

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number,
                                          @PagingAndSortingParam("orders") PagingAndSortingHelper helper){

        return orderService.getPage(number, helper);
    }

    @PostMapping("/edit")
    public Order editCustomer(@Valid Order order){
        return orderService.editOrder(order);
    }

    @GetMapping("/delete/{id}")
    public Order deleteCustomer(@PathVariable("id") Integer id){
        return orderService.deleteOrder(id);
    }

}
