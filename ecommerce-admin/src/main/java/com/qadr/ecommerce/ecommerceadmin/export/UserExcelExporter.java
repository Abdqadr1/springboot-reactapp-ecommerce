package com.qadr.ecommerce.ecommerceadmin.export;

import com.qadr.ecommerce.ecommerceadmin.model.User;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.xssf.usermodel.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class UserExcelExporter extends AbstractExporter {
    public XSSFWorkbook workbook;
    public XSSFSheet sheet;

    public UserExcelExporter(){
        workbook = new XSSFWorkbook();
    }

    public void writeHeaders(){
        sheet = workbook.createSheet("users_sheet");
        XSSFRow row = sheet.createRow(0);

        XSSFCellStyle cellStyle = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(13);
        cellStyle.setFont(font);
        cellStyle.setAlignment(HorizontalAlignment.LEFT);

        createCell(row, 0, "User ID", cellStyle);
        createCell(row, 1, "Email", cellStyle);
        createCell(row, 2, "First Name", cellStyle);
        createCell(row, 3, "Last Name", cellStyle);
        createCell(row, 4, "Roles", cellStyle);
        createCell(row, 5, "Enabled", cellStyle);

    }

    public void createCell(XSSFRow row, Integer columnIndex, Object value, CellStyle style){
        XSSFCell cell = row.createCell(columnIndex);

        if(value instanceof String){
            cell.setCellValue((String) value);
        }else if (value instanceof Integer){
            cell.setCellValue((Integer) value);
        } else if (value instanceof Boolean){
            cell.setCellValue((Boolean) value);
        }else if (value instanceof Long){
            cell.setCellValue((Long) value);
        }


        cell.setCellStyle(style);
    }

    public void export(List<User> users, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "xlsx", "application/octet-stream", "users");

        writeHeaders();
        writeData(users);

        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);

        workbook.close();
        outputStream.close();
    }

    private void writeData(List<User> users) {
        int rowNumber = 1;
        XSSFCellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setAlignment(HorizontalAlignment.LEFT);

        for (User user: users){
            XSSFRow row = sheet.createRow(rowNumber);
            createCell(row, 0, user.getId(), cellStyle);
            createCell(row, 1, user.getEmail(), cellStyle);
            createCell(row, 2, user.getFirstName(), cellStyle);
            createCell(row, 3, user.getLastName(), cellStyle);
            createCell(row, 4, user.getRoles().toString(), cellStyle);
            createCell(row, 5, user.isEnabled(), cellStyle);

            rowNumber++;
        }
    }
}

