import axios from "axios";
import PDFDocument from "pdfkit";
import * as fs from "fs";

export const generateInvoicePDF = async () => {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Make the HTTP request to the invoice generator API
  const response = await axios.post(
    "https://invoice-generator.com",
    {
      from: "Nikolaus Ltd",
      to: "Acme, Corp.",
      number: 1,
      items: [
        {
          name: "Starter plan",
          quantity: 1,
          unit_cost: 99,
        },
      ],
      notes: "Thanks for your business!",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    }
  );

  // Pipe the response data to the PDF document
  doc.pipe(fs.createWriteStream("invoice.pdf"));
  doc.end();
};
