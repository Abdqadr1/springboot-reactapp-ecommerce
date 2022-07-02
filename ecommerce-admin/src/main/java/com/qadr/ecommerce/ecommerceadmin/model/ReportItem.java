package com.qadr.ecommerce.ecommerceadmin.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter @Setter
public class ReportItem {
    private String identifier;
    private float grossSales;
    private float netSales;
    private int ordersCount;

    public ReportItem() {
    }

    public ReportItem(String identifier, float grossSales, float netSales) {
        this.identifier = identifier;
        this.grossSales = grossSales;
        this.netSales = netSales;
    }

    public ReportItem(String identifier) {
        this.identifier = identifier;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReportItem that = (ReportItem) o;
        return identifier.equals(that.identifier);
    }

    @Override
    public int hashCode() {
        return Objects.hash(identifier);
    }

    public void addGrossSales(float total) {
        grossSales += total;
    }

    public void addNetSales(float amount) {
        netSales += amount;
    }

    public void increaseOrdersCount() {
        ordersCount++;
    }
}
