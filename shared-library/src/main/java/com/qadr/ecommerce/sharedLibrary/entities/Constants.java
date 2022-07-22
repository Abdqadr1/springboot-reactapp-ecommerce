package com.qadr.ecommerce.sharedLibrary.entities;

public class Constants {
    public static final String S3_BASE_URI;
    public static final String BRAND_IMAGE_FOLDER_NAME = "brand-photos";
    public static final String USER_IMAGE_FOLDER_NAME = "user-photos";
    public static final String CATEGORY_IMAGE_FOLDER_NAME = "category-photos";
    public static final String PRODUCT_IMAGE_FOLDER_NAME = "product-images";
    public static final String SITE_IMAGE_FOLDER_NAME = "site-logo";
    public static final String ECOMMERCE_URL;
    static {
        String bucketName = System.getenv("AWS_BUCKET_NAME");
        String bucketRegion = System.getenv("AWS_BUCKET_REGION");
        String pattern = "https://%s.s3.%s.amazonaws.com/";
        String uri = String.format(pattern, bucketName, bucketRegion);
        S3_BASE_URI = bucketName == null ? "" : uri;
        ECOMMERCE_URL = System.getenv("ECOMMERCE_URL");
    }
}
