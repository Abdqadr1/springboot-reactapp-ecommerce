package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.ecommerceadmin.model.ReportItem;
import com.qadr.ecommerce.ecommerceadmin.model.ReportType;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderDetail;
import com.qadr.ecommerce.sharedLibrary.repo.OrderDetailsRepo;
import com.qadr.ecommerce.sharedLibrary.repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class OrderSalesReportService extends AbstractSalesService{
    @Autowired private OrderRepo orderRepo;
    public List<ReportItem> getReportByCustomDateRange(Date startDate, Date endDate) {
        dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        return getDataByDateRange(startDate, endDate, ReportType.DAYS);
    }
    public List<ReportItem> getDataByDateRange(Date startDate, Date endDate, ReportType type) {
        List<Order> orders = orderRepo.findByOrderTimeBetween(startDate, endDate);
//        printData(orders);
        List<ReportItem> reportData = createReportData(startDate, endDate, type);
        calculateSalesForReportData(orders, reportData);
//        printReportData(reportData);
        return  reportData;
    }

    public void calculateSalesForReportData(List<Order> orders, List<ReportItem> reportItems){
        for(Order order : orders){
            String dateString = dateFormatter.format(order.getOrderTime());
            int index = reportItems.indexOf(new ReportItem(dateString));
            if(index >= 0){
                ReportItem reportItem= reportItems.get(index);
                reportItem.addGrossSales(order.getTotal());
                reportItem.addNetSales(order.getSubtotal() - order.getProductCost());
                reportItem.increaseOrdersCount();
            }else {
                reportItems.add(new ReportItem(dateString, order.getTotal(),
                        order.getSubtotal() - order.getProductCost()));
            }
        }
    }

    protected List<ReportItem> createReportData(Date startTime, Date endTime, ReportType type) {
        List<ReportItem> reportItems = new ArrayList<>();
        Calendar startDate = Calendar.getInstance();
        startDate.setTime(startTime);

        Calendar endDate = Calendar.getInstance();
        endDate.setTime(endTime);


        Date currentDate = startDate.getTime();
        String dateString = dateFormatter.format(currentDate);
        reportItems.add(new ReportItem(dateString));

        int adding = Objects.equals(type, ReportType.DAYS) ? Calendar.DAY_OF_MONTH : Calendar.MONTH;

        do{
            startDate.add(adding, 1);
            currentDate = startDate.getTime();
            dateString = dateFormatter.format(currentDate);
            reportItems.add(new ReportItem(dateString));
        }while (startDate.before(endDate));

        return  reportItems;
    }


    protected void printReportData(List<ReportItem> reportData) {
        reportData.forEach(
                item -> System.out.printf("%20s | %10.2f | %10.2f | %d \n",
                        item.getIdentifier(), item.getGrossSales(), item.getNetSales(), item.getOrdersCount()));
    }

    protected void printData(List<Order> byOrderTimeBetween) {
        byOrderTimeBetween.forEach(
                order -> System.out.printf("%-3d | %s | %.2f | %.2f | %.2f \n",
                        order.getId(), order.getOrderTime(), order.getProductCost(),
                        order.getSubtotal(), order.getTotal()));
    }


}
