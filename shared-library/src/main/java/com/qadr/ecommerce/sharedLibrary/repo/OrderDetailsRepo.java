package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrderDetailsRepo extends JpaRepository<OrderDetail, Integer> {
    @Query("SELECT NEW com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail(" +
            "o.product.category.name, o.quantity, o.shippingCost, o.productCost, o.subtotal)" +
            " FROM OrderDetail o WHERE o.order.orderTime BETWEEN ?1 AND ?2 ORDER BY o.order.orderTime ASC")
    List<OrderDetail> findWithCategoryAndTimeBetween(Date s, Date e);

    @Query("SELECT NEW com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail(" +
            "o.quantity,o.product.name,  o.shippingCost, o.productCost, o.subtotal)" +
            " FROM OrderDetail o WHERE o.order.orderTime BETWEEN ?1 AND ?2 ORDER BY o.order.orderTime ASC")
    List<OrderDetail> findWithProductAndTimeBetween(Date s, Date e);

    @Query("SELECT COUNT(d) FROM OrderDetail d JOIN OrderTrack t ON d.order.id = t.order.id " +
            "WHERE d.product.id = ?1 AND d.order.customer.id = ?2 AND t.status = ?3")
    Long countByProductAndCustomerAndStatus(Integer productId, Integer customerId, OrderStatus status);
}
