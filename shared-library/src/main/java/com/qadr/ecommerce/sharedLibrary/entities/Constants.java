package com.qadr.ecommerce.sharedLibrary.entities;

public class Constants {
    public static final String S3_BASE_URI;
    static {
        String bucketName = System.getenv("AWS_BUCKET_NAME");
        String bucketRegion = System.getenv("AWS_BUCKET_REGION");
        String pattern = "https://%s.s3.%s.amazonaws.com/";
        String uri = String.format(pattern, bucketName, bucketRegion);

        S3_BASE_URI = bucketName == null ? "" : uri;
    }
}
