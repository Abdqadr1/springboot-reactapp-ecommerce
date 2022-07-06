package com.qadr.ecommerce.ecommercecommon.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qadr.ecommerce.ecommercecommon.model.VoteResult;
import io.netty.channel.epoll.EpollServerChannelConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReviewVoteControllerTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;

    @WithMockUser(username = "nancy.bass2001@yahoo.com")
    @Test
    void voteReview() throws Exception {
        String url = "/review_vote/vote/5/UP";
        MvcResult mvcResult = mockMvc.perform(post(url)).andExpect(status().isOk()).andDo(print())
                .andReturn();
        VoteResult voteResult =
                objectMapper.readValue(mvcResult.getResponse().getContentAsString(), VoteResult.class);
        System.out.println(voteResult);
    }
}