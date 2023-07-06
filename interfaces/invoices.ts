export interface InvoiceFields {
  from: PersonalDetails;
  to: PersonalDetails;
  items: InvoiceItemFields[];
  notes: string;
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
  number?: string;
  businessNumber?: string;
}
