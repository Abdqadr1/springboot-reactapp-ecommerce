package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.model.ReportItem;
import com.qadr.ecommerce.ecommerceadmin.service.SalesReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/sales_report")
public class SalesReportController {
    @Autowired private SalesReportService salesReportService;

    @GetMapping("/by_date/{period}")
    public List<ReportItem> getByDate(@PathVariable("period") String period){
        RangeType rangeType = RangeType.valueOf(period.toUpperCase());
        switch (rangeType){
            case LAST_28_DAYS -> {
                return salesReportService.getLast28DaysReport();
            }
            case LAST_6_MONTHS -> {
                return salesReportService.getLast6MonthsReport();
            }
            case LAST_YEAR -> {
                return salesReportService.getLastYearReport();
            }
            default -> {
                return salesReportService.getLast7DaysReport();
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

        System.out.println("Start date " + startDate);
        System.out.println("End date " + endDate);
        return salesReportService.getReportByCustomDateRange(startTime, endTime);
    }

    private enum RangeType{
        LAST_7_DAYS, LAST_28_DAYS, LAST_6_MONTHS, LAST_YEAR
    }
}
