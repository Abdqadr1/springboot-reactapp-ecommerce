package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepo extends SearchRepository<Order, Integer> {


    @Query("SELECT o FROM Order o WHERE CONCAT(o.firstName,' ', o.lastName,' ', o.customer.firstName, ' '," +
            "o.customer.lastName, ' ', o.mainAddress,' ',o.extraAddress, ' ', o.state,' ',o.postalCode," +
            "' ',o.city,' ',o.country, ' ', o.paymentMethod, ' ', o.orderStatus) LIKE %?1%")
    Page<Order> searchKeyword(String keyword, Pageable pageable);



    @Query("SELECT o FROM Order o")
    Page<Order> find(String keyword, Integer id, String catId, Pageable pageable);
}
