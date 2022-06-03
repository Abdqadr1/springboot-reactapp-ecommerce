package com.qadr.ecommerce.ecommerceadmin.export;

import javax.servlet.http.HttpServletResponse;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public abstract class AbstractExporter {
    public void setResponseHeader(HttpServletResponse response, String extension, String contentType){
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String timeStamp = dateFormatter.format(new Date());
        String fileName = "users_"+timeStamp+"."+extension;
        response.setContentType(contentType);
        response.setHeader("Content-Disposition", "attachment; filename="+fileName);
    }
}
