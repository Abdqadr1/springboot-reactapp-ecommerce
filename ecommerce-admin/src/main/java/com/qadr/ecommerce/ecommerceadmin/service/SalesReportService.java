package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.ecommerceadmin.model.ReportItem;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.repo.OrderDetailsRepo;
import com.qadr.ecommerce.sharedLibrary.repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class SalesReportService {
    @Autowired private OrderRepo orderRepo;
    @Autowired private OrderDetailsRepo orderDetailsRepo;
    private SimpleDateFormat dateFormatter;

    public List<ReportItem> getLast7DaysReport(){
        return getLastXDaysReport(7);
    }

    public List<ReportItem> getLast28DaysReport() {
        return getLastXDaysReport(28);
    }

    public List<ReportItem> getLast6MonthsReport() {
        return getLastXMonthsReport(6);
    }
    public List<ReportItem> getLastYearReport() {
        return getLastXMonthsReport(12);
    }

    public List<ReportItem> getReportByCustomDateRange(Date startDate, Date endDate) {
        dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        return getDataByDateRange(startDate, endDate, "days");
    }

    private List<ReportItem> getLastXDaysReport(int days){
        Date endDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, - (days - 1));
        Date startDate = calendar.getTime();

        dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        System.out.println("Start date " + startDate);
        System.out.println("End date " + endDate);
        return getDataByDateRange(startDate, endDate, "days");
    }

    private List<ReportItem> getLastXMonthsReport(int months){
        Date endDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, - (months - 1));
        Date startDate = calendar.getTime();

        dateFormatter = new SimpleDateFormat("yyyy-MM");
        System.out.println("Start date " + startDate);
        System.out.println("End date " + endDate);
        return getDataByDateRange(startDate, endDate, "months");
    }

    public List<ReportItem> getDataByDateRange(Date startDate, Date endDate, String type) {
        List<Order> orders = orderRepo.findByOrderTimeBetween(startDate, endDate);
        printData(orders);
        List<ReportItem> reportData = createReportData(startDate, endDate, type);
        calculateSalesForReportData(orders, reportData);
        printReportData(reportData);
        return  reportData;
    }

    private void calculateSalesForReportData(List<Order> orders, List<ReportItem> reportItems){
        for(Order order : orders){
            String dateString = dateFormatter.format(order.getOrderTime());
            int index = reportItems.indexOf(new ReportItem(dateString));
            if(index >= 0){
                ReportItem reportItem= reportItems.get(index);
                reportItem.addGrossSales(order.getTotal());
                reportItem.addNetSales(order.getSubtotal() - order.getProductCost());
                reportItem.increaseOrdersCount();
            }
        }
    }

    private List<ReportItem> createReportData(Date startTime, Date endTime, String type) {
        List<ReportItem> reportItems = new ArrayList<>();
        Calendar startDate = Calendar.getInstance();
        startDate.setTime(startTime);

        Calendar endDate = Calendar.getInstance();
        endDate.setTime(endTime);


        Date currentDate = startDate.getTime();
        String dateString = dateFormatter.format(currentDate);
        reportItems.add(new ReportItem(dateString));

        int adding = Objects.equals(type, "days") ? Calendar.DAY_OF_MONTH : Calendar.MONTH;

        do{
            startDate.add(adding, 1);
            currentDate = startDate.getTime();
            dateString = dateFormatter.format(currentDate);
            reportItems.add(new ReportItem(dateString));
        }while (startDate.before(endDate));

        return  reportItems;
    }

    private void printReportData(List<ReportItem> reportData) {
        reportData.forEach(
                item -> System.out.printf("%s | %10.2f | %10.2f | %d \n",
                        item.getIdentifier(), item.getGrossSales(), item.getNetSales(), item.getOrdersCount()));
    }

    private void printData(List<Order> byOrderTimeBetween) {
        byOrderTimeBetween.forEach(
                order -> System.out.printf("%-3d | %s | %.2f | %.2f | %.2f \n",
                        order.getId(), order.getOrderTime(), order.getProductCost(),
                        order.getSubtotal(), order.getTotal()));
    }

}
