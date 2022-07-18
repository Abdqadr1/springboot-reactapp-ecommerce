package com.qadr.ecommerce.ecommercecommon.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.Storefront;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class StorefrontControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired ObjectMapper mapper;
    @Test
    void getAll() throws Exception {
        String url = "/storefront";
        MvcResult mvcResult = mockMvc.perform(get(url))
                .andExpect(status().isOk())
                .andDo(print()).andReturn();
    }
}