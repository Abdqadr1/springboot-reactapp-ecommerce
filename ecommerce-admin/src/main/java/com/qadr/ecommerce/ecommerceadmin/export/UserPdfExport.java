package com.qadr.ecommerce.ecommerceadmin.export;

import com.lowagie.text.Font;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.qadr.ecommerce.ecommerceadmin.model.User;

import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.util.List;

public class UserPdfExport extends AbstractExporter{
    public void export(List<User> users, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "pdf", "application/pdf");

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setColor(Color.GRAY);
        font.setSize(14);
        Paragraph paragraph = new Paragraph("Users Table", font);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        paragraph.setSpacingAfter(10);
        document.add(paragraph);

        PdfPTable pdfTable = new PdfPTable(6);
        pdfTable.setWidthPercentage(100F);
        pdfTable.setWidths(new float[]{1f,3,2,2,3,1.5f});

        writeHeaders(pdfTable);
        writeData(pdfTable, users);

        document.add(pdfTable);

        document.close();
    }

    public void writeHeaders(PdfPTable pdfTable){
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.GRAY);
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);

        cell.setPhrase(new Phrase("ID", font));
        pdfTable.addCell(cell);
        cell.setPhrase(new Phrase("Email", font));
        pdfTable.addCell(cell);
        cell.setPhrase(new Phrase("First Name", font));
        pdfTable.addCell(cell);
        cell.setPhrase(new Phrase("Last Name", font));
        pdfTable.addCell(cell);
        cell.setPhrase(new Phrase("Roles", font));
        pdfTable.addCell(cell);
        cell.setPhrase(new Phrase("Enabled", font));
        pdfTable.addCell(cell);
    }

    public void writeData(PdfPTable pdfTable, List<User> users){
        for (User user : users){
            pdfTable.addCell(user.getId().toString());
            pdfTable.addCell(user.getEmail());
            pdfTable.addCell(user.getFirstName());
            pdfTable.addCell(user.getLastName());
            pdfTable.addCell(user.getRoles().toString());
            pdfTable.addCell(String.valueOf(user.isEnabled()));
        }
    }


}
