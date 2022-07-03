package com.qadr.ecommerce.ecommerceadmin.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SalesReportControllerTest {
    @Autowired private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "admin", authorities ={"Salesperson"})
    void testGetLast7Days() throws Exception {
        String url = "/sales_report/by_date/last_7_days";
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", authorities ={"Salesperson"})
    void testGetLast28Days() throws Exception {
        String url = "/sales_report/by_date/last_28_days";
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", authorities ={"Salesperson"})
    void testGetLast6Months() throws Exception {
        String url = "/sales_report/by_date/last_6_months";
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", authorities ={"Salesperson"})
    void testGetLastYear() throws Exception {
        String url = "/sales_report/by_date/LAST_YEAR";
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", authorities ={"Salesperson"})
    void testGetCustomDateRange() throws Exception {
        String url = "/sales_report/by_date/";
        String startDate = "2022-02-01", endDate = "2022-04-01";
        url += startDate + "/" + endDate;
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", authorities ={"Salesperson"})
    void testGetLast7DaysForCat() throws Exception {
        String url = "/sales_report/by_group/category/last_7_days";
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithMockUser(username = "admin", authorities ={"Salesperson"})
    void testGetLast7DaysForProduct() throws Exception {
        String url = "/sales_report/by_group/product/last_7_days";
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }

}