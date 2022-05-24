package com.qadr.ecommerceadmin.export;

import com.qadr.ecommerceadmin.model.Category;
import com.qadr.ecommerceadmin.model.User;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class UserCsvExport extends AbstractExporter {
    public  void export(List<User> users, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "csv", "text/csv");
        ICsvBeanWriter beanWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

        String[] CSV_HEADER = {"USER ID", "Email", "First Name", "Last Name", "Roles", "Enabled"};
        String[] CSV_DATA_MAPPING = {"id", "email", "firstName","lastName", "roles", "enabled"};
        beanWriter.writeHeader(CSV_HEADER);
        for (User user : users){
            beanWriter.write(user, CSV_DATA_MAPPING);
        }
        beanWriter.close();
    }

    public  void exportCategories(List<Category> categories, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "csv", "text/csv");
        ICsvBeanWriter beanWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

        String[] CSV_HEADER = {"USER ID", "Name", "Alias", "Parent", "Enabled"};
        String[] CSV_DATA_MAPPING = {"id", "name", "alias","parent", "enabled"};
        beanWriter.writeHeader(CSV_HEADER);
        for (Category category : categories){
            beanWriter.write(category, CSV_DATA_MAPPING);
        }
        beanWriter.close();
    }

}
