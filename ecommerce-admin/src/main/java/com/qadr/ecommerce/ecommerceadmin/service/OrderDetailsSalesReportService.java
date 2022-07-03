package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.ecommerceadmin.model.ReportItem;
import com.qadr.ecommerce.ecommerceadmin.model.ReportType;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail;
import com.qadr.ecommerce.sharedLibrary.repo.OrderDetailsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
@Service
public class OrderDetailsSalesReportService extends AbstractSalesService{
    @Autowired private OrderDetailsRepo orderDetailsRepo;

    public List<ReportItem> getReportByCustomDateRange(Date startDate, Date endDate, ReportType type) {
        dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        return getDataByDateRange(startDate, endDate, type);
    }

    @Override
    public List<ReportItem> getDataByDateRange(Date startDate, Date endDate, ReportType type) {
        List<OrderDetail> orderDetails;
        if(type.equals(ReportType.CATEGORY)){
            orderDetails = orderDetailsRepo.findWithCategoryAndTimeBetween(startDate, endDate);
        }else {
            orderDetails = orderDetailsRepo.findWithProductAndTimeBetween(startDate, endDate);
        }
//        printData(orderDetails, type);
        List<ReportItem> reportData = new ArrayList<>();
        calculateSalesForReportData(orderDetails, reportData, type);
//        printReportData(reportData);
        return  reportData;
    }

    protected void calculateSalesForReportData(List<OrderDetail> orderDetails, List<ReportItem> reportItems,
                                               ReportType type) {
        for(OrderDetail orderDetail : orderDetails){
            String identifier =
                    type.equals(ReportType.CATEGORY) ? orderDetail.getProduct().getCategory().getName()
                            : orderDetail.getProduct().getName();
            int index = reportItems.indexOf(new ReportItem(identifier));
            float grossSales = orderDetail.getSubtotal() + orderDetail.getShippingCost();
            float netSales = orderDetail.getSubtotal() - orderDetail.getProductCost();
            if(index >= 0){
                ReportItem reportItem = reportItems.get(index);
                reportItem.addGrossSales(grossSales);
                reportItem.addNetSales(netSales);
                reportItem.increaseProductCount(orderDetail.getQuantity());
            }else {
                reportItems.add(
                        new ReportItem(identifier,grossSales, netSales, orderDetail.getQuantity()));
            }
        }
    }
    protected void printReportData(List<ReportItem> reportData) {
        reportData.forEach(
                item -> System.out.printf("%-45s | %10.2f | %10.2f | %d \n",
                        item.getIdentifier(), item.getGrossSales(), item.getNetSales(), item.getProductCount()));
    }

    protected void printData(List<OrderDetail> orderDetails, ReportType type) {
        orderDetails.forEach(
                order -> {
                    String identifier =
                            type.equals(ReportType.CATEGORY) ? order.getProduct().getCategory().getName()
                                    : order.getProduct().getShortName();
                    System.out.printf("%-45s | %.2f | %.2f | %.2f \n",
                            identifier, order.getProductCost(),
                            order.getShippingCost(), order.getSubtotal());
                });
    }
}
