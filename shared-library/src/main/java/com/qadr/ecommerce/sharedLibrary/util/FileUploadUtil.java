package com.qadr.ecommerce.sharedLibrary.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

public class FileUploadUtil {
    public static final Logger LOGGER = LoggerFactory.getLogger(FileUploadUtil.class);

    public static void saveFile(MultipartFile file,String uploadDir, String filename) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if(!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        try(InputStream inputStream = file.getInputStream()){
            Path filePath = uploadPath.resolve(filename);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e){
            LOGGER.error("could not upload image", e);
            throw new IOException("could not upload image", e);
        }
    }

    public static void cleanDir(String dir){
        Path dirPath = Paths.get(dir);
        try{
           Files.list(dirPath).forEach((file) -> {
               if(!Files.isDirectory(file)){
                   try {
                       Files.delete(file);
                   } catch (IOException e) {
                       LOGGER.error("could not delete file, "+file.getFileName());
                   }
               }else {
                   removeDir(dir+"/"+file.getFileName().toString());
               }
           });

        } catch (IOException e){
            LOGGER.info("Could not list directory, "+ dirPath);
        }
    }

    public static void removeDir(String dir){
        cleanDir(dir);
        try {
            Files.delete(Paths.get(dir));
        } catch (IOException e) {
            LOGGER.info("Could not delete directory " + dir);
        }
    }

    public static void removeFiles(List<String> pathNames, String dir){
        Path dirPath = Paths.get(dir);
        try{
            Files.list(dirPath).forEach((file) -> {
                if(!pathNames.contains(file.getFileName().toString())){
                    try {
                        Files.delete(file);
                    } catch (IOException e) {
                        LOGGER.error("could not delete file, "+file.getFileName());
                    }
                }
            });

        } catch (IOException e){
            LOGGER.info("Could not list directory, "+ dirPath);
        }
    }
}
