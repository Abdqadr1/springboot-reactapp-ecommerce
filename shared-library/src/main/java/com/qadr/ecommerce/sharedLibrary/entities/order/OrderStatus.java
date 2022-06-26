package com.qadr.ecommerce.sharedLibrary.entities.order;

public enum OrderStatus {
    NEW {
        public String getDescription(){
            return "Order was placed by customer";
        }
    }, CANCELED{
        public String getDescription(){
            return "Order was canceled";
        }
    }, PROCESSING{
        public String getDescription(){
            return "Order is being processed";
        }
    }, PACKAGED{
        public String getDescription(){
            return "Products were packaged";
        }
    }, PICKED{
        public String getDescription(){
            return "Order was picked up by shipper";
        }
    }, SHIPPING{
        public String getDescription(){
            return "Product was being delivered by the shipper";
        }
    }, DELIVERED{
        public String getDescription(){
            return "Customer received products";
        }
    }, RETURN_REQUESTED {
        public String getDescription() {
            return "Customer sent request to return purchase";
        }
    }
    , RETURNED{
        public String getDescription(){
            return "Products were returned";
        }
    }, PAID{
        public String getDescription(){
            return "Customer paid for the order";
        }
    }, REFUNDED{
        public String getDescription(){
            return "Customer was refunded";
        }
    };


    public abstract String getDescription();
}
