package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderStatus;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderTrack;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {
    public static final int ORDERS_PER_PAGE = 10;
    @Autowired private OrderRepo repo;

    public Map<String, Object> getPage(int pageNumber, PagingAndSortingHelper helper){
        return helper.getPageInfo(pageNumber, ORDERS_PER_PAGE, repo);
    }

    public Map<String, Object> getShipperPage(int pageNumber, PagingAndSortingHelper helper){
        Map<String, Object> pageInfo = helper.getShipperOrders(pageNumber, ORDERS_PER_PAGE, repo);
        List<Order> orders = (List<Order>) pageInfo.get(helper.getName());
        orders.forEach(order -> {
            order.setCustomer(null);
        });
        return pageInfo;
    }

    public Order editOrder(Order order) {
        if(order.getId() == null || order.getId() < 1){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Bad Request");
        }
        Order oldOrder = repo.findById(order.getId())
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Could not find order"));
        order.setOrderTime(oldOrder.getOrderTime());
        return repo.save(order);
    }

    public List<Order> getAll() {
        return repo.findAll(Sort.by("firstName").ascending());
    }

    public Order deleteOrder(Integer id) {
        Order order = repo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Could not find order"));
        repo.deleteById(id);
        return order;
    }

    public Map<String, Object> updateStatus(Integer id, String status) {
        OrderStatus orderStatus = OrderStatus.valueOf(status);
        Order order = repo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Could not find order id " + id));
        if(!order.hasStatus(orderStatus)){
            OrderTrack track = new OrderTrack();
            track.setOrder(order);
            track.setUpdatedTime(new Date());
            track.setStatus(orderStatus);
            track.setNote(orderStatus.getDescription());
            order.getOrderTracks().add(track);
            order.setOrderStatus(orderStatus);
            repo.save(order);
        }
        HashMap<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("status", orderStatus);
        return map;
    }
}
