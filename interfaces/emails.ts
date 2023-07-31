import { InvoiceFields, PersonalDetails } from "./invoices";

export interface EmailEndpointParameter {
  encodedInvoice: string;
  invoiceDetails: InvoiceFields;
  customTextContent: string;
}

export interface RecipientStatuses {
  successfullyReceivedEmail: PersonalDetails[];
  emailReceiptError: PersonalDetails[];
}
