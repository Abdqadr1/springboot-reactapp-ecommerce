package com.qadr.ecommerce.ecommerceadmin.export;

import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class CustomerCsvExporter extends AbstractExporter{

    public  void export(List<Customer> customerList, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "csv", "text/csv","customers");

        ICsvBeanWriter beanWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

        String[] CSV_HEADER = {"USER ID", "First Name", "Last Name", "Email","Phone Number","State","Country", "Enabled"};
        String[] CSV_DATA_MAPPING = {"id", "firstName", "lastName","email","phoneNumber","state","country", "enabled"};
        beanWriter.writeHeader(CSV_HEADER);
        for (Customer customer : customerList){
            beanWriter.write(customer, CSV_DATA_MAPPING);
        }
        beanWriter.close();
    }
}
