package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrderDetailsRepo extends CrudRepository<OrderDetail, Integer> {
    @Query("SELECT NEW com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail(" +
            "o.product.category.name, o.quantity, o.shippingCost, o.productCost, o.subtotal)" +
            " FROM OrderDetail o WHERE o.order.orderTime BETWEEN ?1 AND ?2 ORDER BY o.order.orderTime ASC")
    List<OrderDetail> findWithCategoryAndTimeBetween(Date s, Date e);

    @Query("SELECT NEW com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail(" +
            "o.quantity,o.product.name,  o.shippingCost, o.productCost, o.subtotal)" +
            " FROM OrderDetail o WHERE o.order.orderTime BETWEEN ?1 AND ?2 ORDER BY o.order.orderTime ASC")
    List<OrderDetail> findWithProductAndTimeBetween(Date s, Date e);
}
