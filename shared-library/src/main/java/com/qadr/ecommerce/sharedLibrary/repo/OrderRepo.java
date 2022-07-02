package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepo extends SearchRepository<Order, Integer> {


    @Query("SELECT o FROM Order o WHERE CONCAT(o.firstName,' ', o.lastName,' ', o.customer.firstName, ' '," +
            "o.customer.lastName, ' ', o.mainAddress,' ',o.extraAddress, ' ', o.state,' ',o.postalCode," +
            "' ',o.city,' ',o.country, ' ', o.paymentMethod, ' ', o.orderStatus) LIKE %?1%")
    Page<Order> searchKeyword(String keyword, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE CONCAT('#', o.id) LIKE %?1% OR " +
            "CONCAT(o.firstName,' ', o.lastName,' ', o.customer.firstName, ' '," +
            "o.customer.lastName, ' ', o.mainAddress,' ',o.extraAddress, ' ', o.state,' ',o.postalCode," +
            "' ',o.city,' ',o.country, ' ', o.paymentMethod, ' ', o.orderStatus) LIKE %?1%")
    Page<Order> shipperSearch(String keyword, Pageable pageable);



    @Query("SELECT o FROM Order o")
    Page<Order> find(String keyword, Integer id, String catId, Pageable pageable);

    Page<Order> findAllByCustomer(Customer customer, Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderDetails od JOIN od.product p WHERE o.customer.id=?1 " +
            "AND (p.name LIKE %?2% OR o.orderStatus LIKE %?2%)")
    Page<Order> searchAllByCustomer(Integer customer, String keyword, Pageable pageable);

    Optional<Order> findByCustomerAndId(Customer customer, Integer id);

    @Query("SELECT NEW com.qadr.ecommerce.sharedLibrary.entities.order.Order(o.id, o.orderTime, o.productCost, o.subtotal, o.total)  " +
            "FROM Order o WHERE o.orderTime BETWEEN ?1 AND ?2 ORDER BY o.orderTime ASC")
    List<Order> findByOrderTimeBetween(Date startDate, Date endDate);
}
