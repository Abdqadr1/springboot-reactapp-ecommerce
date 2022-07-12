package com.qadr.ecommerce.ecommerceadmin.export;

import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class UserCsvExport extends AbstractExporter {
    public  void export(List<User> users, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "csv", "text/csv","users");
        ICsvBeanWriter beanWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

        String[] CSV_HEADER = {"ID", "Email", "First Name", "Last Name", "Roles", "Enabled"};
        String[] CSV_DATA_MAPPING = {"id", "email", "firstName","lastName", "roles", "enabled"};
        beanWriter.writeHeader(CSV_HEADER);
        for (User user : users){
            beanWriter.write(user, CSV_DATA_MAPPING);
        }
        beanWriter.close();
    }

    public  void exportCategories(List<Category> categories, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "csv", "text/csv","categories");
        ICsvBeanWriter beanWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

        String[] CSV_HEADER = {"ID", "Name", "Alias", "Parent", "Enabled"};
        String[] CSV_DATA_MAPPING = {"id", "name", "alias","parent", "enabled"};
        beanWriter.writeHeader(CSV_HEADER);
        for (Category category : categories){
            beanWriter.write(category, CSV_DATA_MAPPING);
        }
        beanWriter.close();
    }

}
