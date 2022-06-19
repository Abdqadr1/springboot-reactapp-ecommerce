package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.Order;
import com.qadr.ecommerce.sharedLibrary.entities.Order;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.repo.OrderRepo;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class OrderService {
    public static final int ORDERS_PER_PAGE = 10;
    @Autowired private OrderRepo repo;


    public Map<String, Object> getPage(int pageNumber, PagingAndSortingHelper helper){
        return helper.getPageInfo(pageNumber, ORDERS_PER_PAGE, repo);
    }

    public Order editOrder(Order order) {
        if(order.getId() == null || order.getId() < 1){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Bad Request");
        }
        repo.findById(order.getId())
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Could not find order"));
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
}
