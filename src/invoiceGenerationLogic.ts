import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import font from "./assets/misc/Urbanist.js";

let baseInvoiceNumber = "0779";
const fromDetails =
  "Daniel Lee \ntest@gmail.com \nPhone: xxxx xxx xxx \nABN: 123456789";
const notesDetails =
  "Payment VIA direct deposit \nBSB: 123456 \nACC: 123456789";
const termsDetails =
  "NOTE: PLEASE QUOTE YOUR INVOICE NUMBER IN YOUR PAYMENT STATEMENT. THE SYSTEM DETECTS YOUR PAYMENT WITH THIS NUMBER.";

export interface InvoiceFields {
  from: string;
  to: string;
  items: ItemFields[];
  notes: string;
  terms: string;
}

export interface ItemFields {
  name: string;
  quantity: string;
  rate: string;
}

export function generateInvoice(
  invoiceData: InvoiceFields,
  invoiceNumber: string
) {
  const rowTotals = generateInvoiceRowTotals(invoiceData);
  const invoiceTotal = generateInvoiceTotal(rowTotals);
  const rowedItems = generateRowedItems(invoiceData.items);
  const defaultSentDate = new Date().toISOString().split("T")[0];
  const defaultDueDate = getDateAfterOneWeek();

  const doc = new jsPDF();

  doc.addFileToVFS("Urbanist.ttf", font);
  doc.addFont("Urbanist.ttf", "Urbanist", "normal");
  doc.setFont("Urbanist");

  // ? ? ? ? ? ?
  // ? HEADER ?
  // ? ? ? ? ?
  autoTable(doc, {
    body: [
      [
        {
          content: "Voizer",
          styles: {
            halign: "left",
            fontSize: 20,
            textColor: "#ffffff",
            font: "Urbanist",
          },
        },
        {
          content: "Invoice",
          styles: {
            halign: "right",
            fontSize: 20,
            textColor: "#ffffff",
            font: "Urbanist",
          },
        },
      ],
    ],
    theme: "plain",
    styles: {
      fillColor: "#3366ff",
    },
  });

  // ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
  // ? INVOICE NUMBER & SENT DATE ?
  // ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
  autoTable(doc, {
    body: [
      [
        {
          content:
            "Invoice Number: #INV" +
            invoiceNumber +
            "\nDate: " +
            defaultSentDate,
          styles: {
            halign: "right",
            font: "Urbanist",
          },
        },
      ],
    ],
    theme: "plain",
  });

  // ? ? ? ? ? ? ? ? ? ? ? ? ?
  // ? TO AND FROM ADDRESS ?
  // ? ? ? ? ? ? ? ? ? ? ?
  autoTable(doc, {
    body: [
      [
        {
          content: "Billed to:" + "\n" + invoiceData.to,
          // ? if you want to include your address, uncomment these lines "\nBilling Address line 1" +
          // ? if you want to include your address, uncomment these lines "\nBilling Address line 2" +
          // ? if you want to include your address, uncomment these lines "\nZip code - City" +
          // ? if you want to include your address, uncomment these lines "\nCountry"
          styles: {
            halign: "left",
            font: "Urbanist",
          },
        },
        // ? Uncomment to include shipping address
        // {
        //   content:
        //     "Shipping address:" +
        //     "\nJohn Doe" +
        //     "\nShipping Address line 1" +
        //     "\nShipping Address line 2" +
        //     "\nZip code - City" +
        //     "\nCountry",
        //   styles: {
        //     halign: "left",
        //   },
        // },
        {
          content: "From:" + "\n" + invoiceData.from,
          // ? if you want to include your address, uncomment these lines "\nBilling Address line 1" +
          // ? if you want to include your address, uncomment these lines "\nBilling Address line 2" +
          // ? if you want to include your address, uncomment these lines "\nZip code - City" +
          // ? if you want to include your address, uncomment these lines "\nCountry"
          styles: {
            halign: "right",
            font: "Urbanist",
          },
        },
      ],
    ],
    theme: "plain",
  });

  // ? ? ? ? ? ? ? ? ? ? ? ? ? ?
  // ? AMOUNT DUE & DUE DATE ?
  // ? ? ? ? ? ? ? ? ? ? ? ?
  autoTable(doc, {
    body: [
      [
        {
          content: "Amount due:",
          styles: {
            halign: "right",
            fontSize: 14,
            font: "Urbanist",
          },
        },
      ],
      [
        {
          content: "$" + invoiceTotal,
          styles: {
            halign: "right",
            fontSize: 20,
            textColor: "#3366ff",
            font: "Urbanist",
          },
        },
      ],
      [
        {
          content: "Due date: " + defaultDueDate,
          styles: {
            halign: "right",
            font: "Urbanist",
          },
        },
      ],
    ],
    theme: "plain",
  });

  // ? ? ? ? ? ? ? ? ?
  // ? TABLE HEADER ?
  // ? ? ? ? ? ? ? ?
  autoTable(doc, {
    body: [
      [
        {
          content: "Items",
          styles: {
            halign: "left",
            fontSize: 14,
            font: "Urbanist",
          },
        },
      ],
    ],
    theme: "plain",
  });

  // ? ? ? ? ? ? ? ?
  // ? ITEM ROWS ?
  // ? ? ? ? ? ?
  autoTable(doc, {
    head: [["Items", "Quantity", "Price", "Amount"]],
    body: rowedItems,
    theme: "striped",
    headStyles: {
      fillColor: "#343a40",
    },
    styles: {
      font: "Urbanist",
    },
  });

  // ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
  // ? SUBTOTAL, TOTAL TAX & TOTAL AMOUNT ?
  // ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
  autoTable(doc, {
    body: [
      [
        {
          content: "Subtotal:",
          styles: {
            halign: "right",
            font: "Urbanist",
          },
        },
        {
          content: "$" + invoiceTotal,
          styles: {
            halign: "right",
            font: "Urbanist",
          },
        },
      ],
      // ! IF YOU WANT TO ADD TAX, UNCOMENT THIS
      // [
      //   {
      //     content: "Total tax:",
      //     styles: {
      //       halign: "right",
      //     },
      //   },
      //   {
      //     content: "$400",
      //     styles: {
      //       halign: "right",
      //     },
      //   },
      // ],
      [
        {
          content: "Total amount:",
          styles: {
            halign: "right",
            font: "Urbanist",
          },
        },
        {
          content: "$" + invoiceTotal,
          styles: {
            halign: "right",
            font: "Urbanist",
          },
        },
      ],
    ],
    theme: "plain",
  });

  // ? ? ? ? ? ? ? ? ? ?
  // ? TERMS & NOTES ?
  // ? ? ? ? ? ? ? ?
  autoTable(doc, {
    body: [
      [
        {
          content: "Terms & notes",
          styles: {
            halign: "left",
            fontSize: 14,
            font: "Urbanist",
          },
        },
      ],
      [
        {
          content: invoiceData.notes + "\n\n" + invoiceData.terms,
          styles: {
            halign: "left",
            font: "Urbanist",
          },
        },
      ],
    ],
    theme: "plain",
  });

  // ? ? ? ? ? ?
  // ? FOOTER ?
  // ? ? ? ? ?
  // autoTable(doc, {
  //   body: [
  //     [
  //       {
  //         content: "This is a centered footer",
  //         styles: {
  //           halign: "center",
  //         },
  //       },
  //     ],
  //   ],
  //   theme: "plain",
  // });

  return doc.save("invoice");
}

function getDateAfterOneWeek() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const formattedDate = nextWeek.toISOString().split("T")[0];
  return formattedDate;
}

function generateInvoiceTotal(rowAmounts: number[]) {
  return rowAmounts.reduce((prev, curr) => {
    return (prev += curr);
  }, 0);
}

function generateInvoiceRowTotals(invoiceData: InvoiceFields) {
  let rowTotals: number[] = [];
  invoiceData.items.forEach((e) => {
    rowTotals.push(Number(e.quantity) * Number(e.rate));
  });
  return rowTotals;
}

function generateRowedItems(items: ItemFields[]) {
  const allRowedItems: Array<Array<string>> = [];

  // ? row item schema = ["Product or service name", "2", "$450", "$1000"],
  items.forEach((item) => {
    const rowTotal = Number(item.quantity) * Number(item.rate);
    allRowedItems.push([
      item.name,
      item.quantity,
      "$" + item.rate,
      "$" + rowTotal.toString(),
    ]);
  });

  return allRowedItems;
}

export function createAllInvoices(
  allInvoices: InvoiceFields[],
  baseInvoiceNumber: number
) {
  allInvoices.forEach((invoice) => {
    generateInvoice(invoice, baseInvoiceNumber.toString());
  });
}

const testUser: InvoiceFields = {
  from: fromDetails,
  to: "Billy bob",
  items: [
    { name: "Music Lesson - 1 Hour", quantity: "1", rate: "60" },
    { name: "Music Lesson - 1 Hour", quantity: "5", rate: "89.67" },
    { name: "Hinga hjret", quantity: "4", rate: "81.49" },
  ],
  notes: notesDetails,
  terms: termsDetails,
};

const testArray: InvoiceFields[] = [
  {
    from: fromDetails,
    to: "Billy bob",
    items: [
      { name: "Music Lesson - 1 Hour", quantity: "1", rate: "60" },
      { name: "Music Lesson - 1 Hour", quantity: "5", rate: "89.67" },
      { name: "Hinga hjret", quantity: "4", rate: "81.49" },
    ],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "rodger mac",
    items: [
      { name: "Margret thatcher", quantity: "8", rate: "21.99" },
      { name: "Logi maji", quantity: "15", rate: "34.51" },
    ],
    notes: notesDetails,
    terms: termsDetails,
  },
];
