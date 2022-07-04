package com.qadr.ecommerce.ecommercecommon.controllers;

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
class ReviewControllerTest {
    @Autowired private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "alex.stevenson@outlook.com")
    void listByPage() throws Exception {
        String url = "/review/page/1?sortField=reviewTime&dir=desc&keyword=arsenal";
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithMockUser(username = "alex.stevenson@outlook.com")
    void getReview() throws Exception {
        String url = "/review/1";
        mockMvc.perform(get(url)).andExpect(status().isBadRequest()).andDo(print());
    }
}