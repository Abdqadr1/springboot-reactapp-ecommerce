package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.ecommercecommon.model.CheckoutInfo;
import com.qadr.ecommerce.ecommercecommon.utilities.Util;
import com.qadr.ecommerce.sharedLibrary.entities.Address;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.order.*;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.entities.setting.CurrencySettingBag;
import com.qadr.ecommerce.sharedLibrary.entities.setting.EmailSettingBag;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import com.qadr.ecommerce.sharedLibrary.repo.OrderRepo;
import com.qadr.ecommerce.sharedLibrary.util.CommonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class OrderService {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrderService.class);
    public static final int ORDERS_PER_PAGE = 5;
    @Autowired private OrderRepo orderRepo;
    @Autowired private CartService cartService;
    @Autowired private SettingsService settingsService;

    public Map<String, Object> getPage(int pageNumber, Customer customer,
                                       @PagingAndSortingParam("orders") PagingAndSortingHelper helper){
        return helper.getCustomerOrders(pageNumber, customer, ORDERS_PER_PAGE, orderRepo);
    }

    public Order createOrder(Customer customer, List<CartItem> cartItems, CheckoutInfo checkoutInfo, Address address,
                             PaymentMethod paymentMethod) {
        Order order = new Order();
        order.setOrderTime(new Date());
        OrderTrack newTrack = new OrderTrack();
        newTrack.setOrder(order);
        newTrack.setStatus(OrderStatus.NEW);
        newTrack.setUpdatedTime(new Date());
        newTrack.setNote(OrderStatus.NEW.getDescription());
        order.getOrderTracks().add(newTrack);

        if(paymentMethod.equals(PaymentMethod.PAYPAL)){
            order.setOrderStatus(OrderStatus.PAID);
            OrderTrack paidTrack = new OrderTrack();
            paidTrack.setOrder(order);
            paidTrack.setStatus(OrderStatus.PAID);
            paidTrack.setUpdatedTime(new Date());
            paidTrack.setNote(OrderStatus.PAID.getDescription());
            order.getOrderTracks().add(paidTrack);
        }else {
            order.setOrderStatus(OrderStatus.NEW);
        }

        order.setPaymentMethod(paymentMethod);
        order.setCustomer(customer);
        order.copyShippingAddress(address);
        order.setProductCost(checkoutInfo.getProductCost());
        order.setShippingCost(checkoutInfo.getShippingCostTotal());
        order.setTax(0.0f);
        order.setSubtotal(checkoutInfo.getProductTotal());
        order.setDeliveryDays(checkoutInfo.getDeliveryDays());
        order.setDeliveryDate(checkoutInfo.getDeliveryDate());
        order.setTotal(checkoutInfo.getPaymentTotal());

        Set<OrderDetail> orderDetails = order.getOrderDetails();
        cartItems.forEach(cartItem -> {
            Product product = cartItem.getProduct();
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setSubtotal(cartItem.getSubtotal());
            detail.setQuantity(cartItem.getQuantity());
            detail.setProduct(product);
            detail.setProductCost(product.getCost());
            detail.setUnitPrice(product.getRealPrice());
            detail.setShippingCost(cartItem.getShippingCost());

            orderDetails.add(detail);
        });

        cartService.deleteByCustomer(customer);
        Order save = orderRepo.save(order);
        sendConfirmationEmail(save, address);
        return save;
    }

    public OrderTrack requestReturn(Customer customer, Integer id, String reason, String note){
        Order order = orderRepo.findByCustomerAndId(customer, id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Could not find your order id " + id));
        if (order.hasStatus(OrderStatus.RETURN_REQUESTED)){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Return has already been requested for this order");
        }
        OrderTrack track = new OrderTrack();
        track.setUpdatedTime(new Date());
        track.setOrder(order);
        track.setStatus(OrderStatus.RETURN_REQUESTED);
        track.setNote("Reason: "+reason + ((note.isBlank() ? "" : ", "+ note)));
        order.getOrderTracks().add(track);
        order.setOrderStatus(OrderStatus.RETURN_REQUESTED);
        orderRepo.save(order);
        return track;
    }



    private void sendConfirmationEmail(Order order, Address address) {
        try {
            EmailSettingBag emailSettings = settingsService.getEmailSettingsBag();
            CurrencySettingBag currencySettingBag = settingsService.getCurrencySettingBag();
            String content = emailSettings.getOrderConfirmationContent();
            String subject = emailSettings.getOrderConfirmationSubject();
            subject = subject.replace("{{orderid}}", String.valueOf(order.getId()));

            content = content.replace("{{orderid}}", String.valueOf(order.getId()));
            content = content.replace("{{orderTime}}", CommonUtil.dateFormatter(order.getOrderTime()));
            content = content.replace("{{NAME}}", order.getCustomer().getFullName());
            content = content.replace("{{shippingAddress}}", address.toString());
            content = content.replace("{{paymentMethod}}", order.getPaymentMethod().toString());
            content = content.replace("{{total}}", CommonUtil.formatCurrency(order.getTotal(), currencySettingBag));

            Util.sendEmail(emailSettings, order.getCustomer().getEmail(), subject, content);

        } catch (Exception e) {
            LOGGER.info(e.getMessage());
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not send confirmation mail, Try again later");
        }

    }
}
