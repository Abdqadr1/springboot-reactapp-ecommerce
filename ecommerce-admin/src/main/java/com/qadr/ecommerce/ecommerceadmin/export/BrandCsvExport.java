package com.qadr.ecommerceadmin.export;

import com.qadr.ecommerceadmin.model.Brand;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class BrandCsvExport extends AbstractExporter{

    public  void export(List<Brand> brands, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "csv", "text/csv");
        ICsvBeanWriter beanWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

        String[] CSV_HEADER = {"Brand ID", "Name", "Categories"};
        String[] CSV_DATA_MAPPING = {"id", "name", "categories"};
        beanWriter.writeHeader(CSV_HEADER);
        for (Brand brand : brands){
            beanWriter.write(brand, CSV_DATA_MAPPING);
        }
        beanWriter.close();
    }
}
