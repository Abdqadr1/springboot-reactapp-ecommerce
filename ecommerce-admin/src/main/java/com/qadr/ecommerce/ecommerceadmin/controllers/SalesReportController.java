package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.model.ReportItem;
import com.qadr.ecommerce.ecommerceadmin.model.ReportType;
import com.qadr.ecommerce.ecommerceadmin.service.OrderDetailsSalesReportService;
import com.qadr.ecommerce.ecommerceadmin.service.OrderSalesReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/sales_report")
public class SalesReportController {
    @Autowired private OrderSalesReportService orderSalesReportService;
    @Autowired private OrderDetailsSalesReportService detailsSalesReportService;

    @GetMapping("/by_date/{period}")
    public List<ReportItem> getByDate(@PathVariable("period") String period){
        RangeType rangeType = RangeType.valueOf(period.toUpperCase());
        switch (rangeType){
            case LAST_28_DAYS -> {
                return orderSalesReportService.getLast28DaysReport(ReportType.DAYS);
            }
            case LAST_6_MONTHS -> {
                return orderSalesReportService.getLast6MonthsReport(ReportType.MONTHS);
            }
            case LAST_YEAR -> {
                return orderSalesReportService.getLastYearReport(ReportType.MONTHS);
            }
            default -> {
                return orderSalesReportService.getLast7DaysReport(ReportType.DAYS);
            }

        }
    }

    @GetMapping("/by_date/{startDate}/{endDate}")
    public List<ReportItem> getByDateRanger(
            @PathVariable("startDate") String startDate,
            @PathVariable("endDate") String endDate) throws ParseException {
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        Date startTime = dateFormatter.parse(startDate);
        Date endTime = dateFormatter.parse(endDate);

        return orderSalesReportService.getReportByCustomDateRange(startTime, endTime);
    }

    @GetMapping("/by_group/{group_by}/{period}")
    public List<ReportItem> getByDateForCat(
            @PathVariable("period") String period, @PathVariable("group_by") String group){
        RangeType rangeType = RangeType.valueOf(period.toUpperCase());
        ReportType reportType = ReportType.valueOf(group.toUpperCase());
        switch (rangeType){
            case LAST_28_DAYS -> {
                return detailsSalesReportService.getLast28DaysReport(reportType);
            }
            case LAST_6_MONTHS -> {
                return detailsSalesReportService.getLast6MonthsReport(reportType);
            }
            case LAST_YEAR -> {
                return detailsSalesReportService.getLastYearReport(reportType);
            }
            default -> {
                return detailsSalesReportService.getLast7DaysReport(reportType);
            }

        }
    }

    @GetMapping("/{group_by}/{startDate}/{endDate}")
    public List<ReportItem> getByDateRangeGrouping(
            @PathVariable("startDate") String startDate,
            @PathVariable("endDate") String endDate,
            @PathVariable("group_by") String group) throws ParseException {
        ReportType reportType = ReportType.valueOf(group.toUpperCase());
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        Date startTime = dateFormatter.parse(startDate);
        Date endTime = dateFormatter.parse(endDate);

        return detailsSalesReportService.getReportByCustomDateRange(startTime, endTime, reportType);
    }

    private enum RangeType{
        LAST_7_DAYS, LAST_28_DAYS, LAST_6_MONTHS, LAST_YEAR
    }
}
