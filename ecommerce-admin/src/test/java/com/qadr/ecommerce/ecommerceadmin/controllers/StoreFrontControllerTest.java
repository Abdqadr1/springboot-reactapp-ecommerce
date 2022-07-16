package com.qadr.ecommerce.ecommerceadmin.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class StoreFrontControllerTest {
    @Autowired private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "editor", authorities ={"Editor"})
    void moveMenu() throws Exception {
        String url = "/storefront/move";
        mockMvc.perform(post(url)
                .param("id", String.valueOf(2))
                .param("move", "up"))
                .andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithMockUser(username = "editor", authorities ={"Editor"})
    void updateEnabled() throws Exception {
        String url = "/storefront/2/enable/true";
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithMockUser(username = "editor", authorities ={"Editor"})
    void listByPage() throws Exception {
        String url = "/storefront/page";
        mockMvc.perform(get(url)).andExpect(status().isOk()).andDo(print());
    }
}