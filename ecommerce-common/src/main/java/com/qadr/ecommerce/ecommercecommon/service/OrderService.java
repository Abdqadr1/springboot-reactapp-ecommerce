package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.ecommercecommon.model.CheckoutInfo;
import com.qadr.ecommerce.ecommercecommon.utilities.Util;
import com.qadr.ecommerce.sharedLibrary.entities.Address;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderStatus;
import com.qadr.ecommerce.sharedLibrary.entities.order.PaymentMethod;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.entities.setting.CurrencySettingBag;
import com.qadr.ecommerce.sharedLibrary.entities.setting.EmailSettingBag;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
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
import java.util.Set;

@Service
@Transactional
public class OrderService {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrderService.class);
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private CartService cartService;
    @Autowired
    private SettingsService settingsService;


    public Order createOrder(Customer customer, List<CartItem> cartItems, CheckoutInfo checkoutInfo, Address address,
                             PaymentMethod paymentMethod) {
        Order order = new Order();
        order.setOrderTime(new Date());

        order.setOrderStatus(paymentMethod.equals(PaymentMethod.PAYPAL) ? OrderStatus.PAID :OrderStatus.NEW);

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

    private void sendConfirmationEmail(Order order, Address address) {
        try {
            EmailSettingBag emailSettings = settingsService.getEmailSettingsBag();
            CurrencySettingBag currencySettingBag = settingsService.getCurrencySettingBag();
            JavaMailSenderImpl javaMailSender = Util.prepareMailSender(emailSettings);
            String content = emailSettings.getOrderConfirmationContent();
            String subject = emailSettings.getOrderConfirmationSubject();
            subject = subject.replace("{{orderid}}", String.valueOf(order.getId()));

            content = content.replace("{{orderid}}", String.valueOf(order.getId()));
            content = content.replace("{{orderTime}}", CommonUtil.dateFormatter(order.getOrderTime()));
            content = content.replace("{{NAME}}", order.getCustomer().getFullName());
            content = content.replace("{{shippingAddress}}", address.toString());
            content = content.replace("{{paymentMethod}}", order.getPaymentMethod().toString());
            content = content.replace("{{total}}", CommonUtil.formatCurrency(order.getTotal(), currencySettingBag));

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
            helper.setFrom(emailSettings.getMailFrom(), emailSettings.getMailSenderName());
            helper.setTo(order.getCustomer().getEmail());
            helper.setSubject(subject);
            helper.setText(content, true);
            javaMailSender.send(mimeMessage);

        } catch (Exception e) {
            LOGGER.info(e.getMessage());
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not send confirmation mail, Try again later");
        }

    }
}
