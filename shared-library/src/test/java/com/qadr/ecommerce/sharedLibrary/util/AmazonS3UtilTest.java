package com.qadr.ecommerce.sharedLibrary.util;

import org.junit.jupiter.api.Test;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AmazonS3UtilTest {
    @Test
    void testListFolder(){
        String folderName = "test-upload";
        List<String> keys = AmazonS3Util.listFolderKey(folderName);
        keys.forEach(System.out::println);
    }

    @Test
    void testUploadFile() throws FileNotFoundException {
        String folderName = "test-upload/2";
        String fileName = "forever900.jpg";
        String path = "C:\\Users\\HP\\Pictures\\" + fileName;
        InputStream inputStream = new FileInputStream(path);
        AmazonS3Util.uploadFile(folderName, fileName, inputStream);
    }

    @Test
    void testDeleteFile(){
        String fileName = "test-upload/test/1/forever900.jpg";
        AmazonS3Util.deleteFile(fileName);
    }

    @Test
    void testRemoveFolder(){
        String folderName = "test-upload";
        AmazonS3Util.removeFolder(folderName);
    }
}