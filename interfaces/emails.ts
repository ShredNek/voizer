import { InvoiceFields } from "./invoices";

export interface EmailEndpointParameter {
  encodedInvoice: string;
  invoiceDetails: InvoiceFields;
  customTextContent: string;
}
