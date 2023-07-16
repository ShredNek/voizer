export interface InvoiceFields {
  from: PersonalDetails;
  to: PersonalDetails;
  items: InvoiceItemFields[];
  notes?: string;
  invoiceNumber: string;
}

export interface InvoiceItemFields {
  itemName: string;
  quantity: string;
  rate: string;
}

export interface PersonalDetails {
  name: string;
  email: string;
  contactNumber?: string;
  businessNumber?: string;
}

export interface InvoiceSenderDetailsState extends PersonalDetails {
  notes?: string;
  baseInvoiceNumber: string;
}

export interface InvoiceRecipientItemState extends InvoiceItemFields {
  key: string;
}

export interface InvoiceRecipientDetailsState extends PersonalDetails {
  address?: string;
  items: InvoiceRecipientItemState[];
  invoiceTotal: number;
  invoiceNumber: string;
}

export interface Client {
  name: string;
  email: string;
  items: InvoiceItemFields[];
}

export interface UserInput {
  baseNumber: string;
  senderDetails: PersonalDetails;
  students: Client[];
  notes: string;
}

export type invoiceReturnMethod = "download" | "email";
