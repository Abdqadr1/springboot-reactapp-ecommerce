package com.qadr.ecommerce.ecommerceadmin.service;
import com.qadr.ecommerce.ecommerceadmin.model.ReportItem;
import com.qadr.ecommerce.ecommerceadmin.model.ReportType;

import java.text.SimpleDateFormat;
import java.util.*;

public abstract class AbstractSalesService {
    protected SimpleDateFormat dateFormatter;
    public List<ReportItem> getLast7DaysReport(ReportType type){ return getLastXDaysReport(7, type);}

    public List<ReportItem> getLast28DaysReport(ReportType type) {
        return getLastXDaysReport(28,  type);
    }

    public List<ReportItem> getLast6MonthsReport(ReportType type) {
        return getLastXMonthsReport(6,  type);
    }
    public List<ReportItem> getLastYearReport(ReportType type) {
        return getLastXMonthsReport(12, type);
    }

    protected List<ReportItem> getLastXDaysReport(int days, ReportType type){
        Date endDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, - (days - 1));
        Date startDate = calendar.getTime();

        dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        System.out.println("Start date " + startDate);
        System.out.println("End date " + endDate);
        return getDataByDateRange(startDate, endDate, type);
    }

    protected List<ReportItem> getLastXMonthsReport(int months, ReportType type){
        Date endDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, - (months - 1));
        Date startDate = calendar.getTime();

        dateFormatter = new SimpleDateFormat("yyyy-MM");
        System.out.println("Start date " + startDate);
        System.out.println("End date " + endDate);
        return getDataByDateRange(startDate, endDate, type);
    }


    public abstract List<ReportItem> getDataByDateRange(Date startDate, Date endDate, ReportType type);
}
