package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.*;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderStatus;
import com.qadr.ecommerce.sharedLibrary.entities.order.PaymentMethod;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.repo.OrderRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class OrderTest {
    @Autowired private OrderRepo orderRepo;
    @Autowired TestEntityManager entityManager;

    @Test
    void testAddOrder(){
        Customer customer = entityManager.find(Customer.class, 7);
        Product product = entityManager.find(Product.class, 4);

        Order order = new Order();
        order.setCity(customer.getCity());
        order.setCountry(customer.getCountry().getName());
        order.setState(customer.getState());
        order.setCustomer(customer);
        order.setProductCost(product.getCost());
        order.setShippingCost(10);
        order.setOrderTime(new Date());
        order.setFirstName(customer.getFirstName());
        order.setLastName(customer.getLastName());
        order.setTax(0);
        order.setSubtotal(product.getPrice());
        order.setTotal(product.getPrice() + 10);
        order.setMainAddress(customer.getMainAddress());
        order.setExtraAddress(customer.getExtraAddress());
        order.setPostalCode(customer.getPostalCode());
        order.setPhoneNumber(customer.getPhoneNumber());
        order.setOrderStatus(OrderStatus.NEW);
        order.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        order.setDeliveryDate(new Date());
        order.setDeliveryDays(1);

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrder(order);
        orderDetail.setProduct(product);
        orderDetail.setProductCost(product.getPrice());
        orderDetail.setShippingCost(10);
        orderDetail.setQuantity(2);
        orderDetail.setUnitPrice(product.getPrice() * 2);
        orderDetail.setSubtotal(product.getPrice());

        order.getOrderDetails().add(orderDetail);
        Order save = orderRepo.save(order);
        assertThat(save).isNotNull();
    }

    @Test
    void testAddMultipleOrders(){
        float tax = 12.54f, shippingCost = 12.9f;
        Customer customer1 = entityManager.find(Customer.class, 4);
        Product product1 = entityManager.find(Product.class, 12);

        Customer customer2 = entityManager.find(Customer.class, 10);
        Product product2 = entityManager.find(Product.class, 10);
        List<Order> orders = List.of(
                getOrder(customer1, product1, tax, 3, shippingCost, OrderStatus.PACKAGED, PaymentMethod.CREDIT_CARD),
                getOrder(customer2, product2, tax, 3, shippingCost, OrderStatus.DELIVERED, PaymentMethod.COD)
        );
        List<Order> savedOrders = orderRepo.saveAll(orders);
        assertThat(savedOrders.size()).isGreaterThan(0);
    }

    @Test
    void testListAllOrders(){
        List<Order> all = orderRepo.findAll();
        assertThat(all.size()).isGreaterThan(0);
        all.forEach(System.out::println);
    }

    @Test
    void testUpdateOrder(){
        int id = 2;
        Order order = orderRepo.findById(id).get();
        order.setOrderStatus(OrderStatus.SHIPPING);
        order.setPaymentMethod(PaymentMethod.COD);
        order.setDeliveryDate(new Date());
        order.setDeliveryDays(4);
        Order save = orderRepo.save(order);
        assertThat(save).isNotNull();
        assertThat(save.getOrderStatus()).isEqualTo(OrderStatus.SHIPPING);
    }

    @Test
    void testGetOrder(){
        int id = 2;
        Order order = orderRepo.findById(id).get();
        assertThat(order).isNotNull();
        System.out.println(order);
    }

    @Test
    void testDeleteOrder(){
        int id = 2;
        orderRepo.deleteById(id);
        Optional<Order> order = orderRepo.findById(id);
        assertThat(order).isNotPresent();
    }



    Order getOrder(Customer customer, Product product, float tax, int quantity,
                   float shippingCost, OrderStatus orderStatus, PaymentMethod paymentMethod){
        Order order = new Order();
        order.setCity(customer.getCity());
        order.setCountry(customer.getCountry().getName());
        order.setState(customer.getState());
        order.setCustomer(customer);
        order.setProductCost(product.getCost());
        order.setShippingCost(shippingCost);
        order.setOrderTime(new Date());
        order.setFirstName(customer.getFirstName());
        order.setLastName(customer.getLastName());
        order.setTax(tax);
        order.setSubtotal(product.getPrice());
        order.setTotal(product.getPrice() + shippingCost);
        order.setMainAddress(customer.getMainAddress());
        order.setExtraAddress(customer.getExtraAddress());
        order.setPostalCode(customer.getPostalCode());
        order.setPhoneNumber(customer.getPhoneNumber());
        order.setOrderStatus(orderStatus);
        order.setPaymentMethod(paymentMethod);
        order.setDeliveryDate(new Date());
        order.setDeliveryDays(1);

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrder(order);
        orderDetail.setProduct(product);
        orderDetail.setProductCost(product.getPrice());
        orderDetail.setShippingCost(shippingCost);
        orderDetail.setQuantity(quantity);
        orderDetail.setUnitPrice(product.getPrice() * quantity);
        orderDetail.setSubtotal(product.getPrice());

        order.getOrderDetails().add(orderDetail);
        return  order;
    }

}
