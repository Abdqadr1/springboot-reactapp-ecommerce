package com.qadr.ecommerce.ecommercecommon.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class VoteResult {
    private String message;
    private boolean isSuccessful;
    private int voteCount;

    public static VoteResult fail(String message){
        return new VoteResult( message, false,0);
    }

    public static VoteResult success(String message, Integer voteCount){
        return new VoteResult( message, true,voteCount);
    }
}
