package com.qadr.ecommerce.ecommercecommon.model;

public enum VoteType {
    UP {
        @Override
        public String toString() {
            return "up";
        }
    }, DOWN {
        @Override
        public String toString() {
            return "down";
        }
    };
}
