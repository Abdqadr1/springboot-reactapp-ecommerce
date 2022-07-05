package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderStatus;
import com.qadr.ecommerce.sharedLibrary.repo.OrderDetailsRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;


@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class OrderDetailsRepoTest {
    @Autowired
    private OrderDetailsRepo repo;

    @Test
    void testFindWithCategoryAndTimeBetween() throws ParseException {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = dateFormat.parse("2021-09-01");
        Date endDate = dateFormat.parse("2021-09-30");
        List<OrderDetail> byOrderTimeBetween = repo.findWithCategoryAndTimeBetween(startDate, endDate);
        assertThat(byOrderTimeBetween.size()).isGreaterThan(0);
        byOrderTimeBetween.forEach(o -> System.out.printf("%-30s| %d | %.2f \t | %.2f \t | %.2f \n",
                o.getProduct().getCategory(), o.getQuantity(), o.getShippingCost(), o.getProductCost(), o.getSubtotal()));
    }

    @Test
    void testFindWithProductAndTimeBetween() throws ParseException {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = dateFormat.parse("2021-09-01");
        Date endDate = dateFormat.parse("2021-09-30");
        List<OrderDetail> byOrderTimeBetween = repo.findWithProductAndTimeBetween(startDate, endDate);
        assertThat(byOrderTimeBetween.size()).isGreaterThan(0);
        byOrderTimeBetween.forEach(o -> System.out.printf("%-50s| %d | %.2f \t | %.2f \t | %.2f \n",
                o.getProduct().getShortName(), o.getQuantity(), o.getShippingCost(), o.getProductCost(), o.getSubtotal()));
    }

    @Test
    void testCountByProductAndCustomerAndStatus(){
        int productId = 106; int customerId = 1;
        OrderStatus status = OrderStatus.DELIVERED;
        Long count = repo.countByProductAndCustomerAndStatus(productId, customerId, status);
        System.out.println("count is " + count);
        assertThat(count).isGreaterThan(0);
    }
}