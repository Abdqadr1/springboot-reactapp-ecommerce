package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.repo.OrderRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.annotation.Rollback;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class OrderRepoTest {
    @Autowired private OrderRepo repo;

    @Test
    void testFindByCustomer(){
        PageRequest pageRequest = PageRequest.of(0, 2);
        Page<Order> byCustomers = repo.findAllByCustomer(new Customer(7), pageRequest);
        assert byCustomers != null;
        System.out.println(byCustomers.getContent().toString());
        int size = byCustomers.getContent().size();
        assertThat(size).isGreaterThan(0);
    }

    @Test
    void testFindByCustomerAndId(){
        int customerId = 7;
        int id = 25;
        Optional<Order> byCustomers = repo.findByCustomerAndId(new Customer(customerId), id);
        assertThat(byCustomers).isPresent();
        System.out.println(byCustomers.get());
    }
    @Test
    void testFindOrdersByOrderTime() throws ParseException {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = dateFormat.parse("2021-09-01");
        Date endDate = dateFormat.parse("2021-09-30");
        List<Order> byOrderTimeBetween = repo.findByOrderTimeBetween(startDate, endDate);
        assertThat(byOrderTimeBetween.size()).isGreaterThan(0);
        byOrderTimeBetween.forEach(o -> {
            System.out.printf("%d |%s |%.2f |%.2f |%.2f | \n",
                    o.getId(), o.getOrderTime(), o.getProductCost(), o.getSubtotal(), o.getTotal());
        });
    }
}