import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import font from "./largeAssets/Urbanist.js";

interface InvoiceFields {
  from: string;
  to: string;
  items: ItemFields[];
  notes: string;
  terms: string;
}

interface ItemFields {
  name: string;
  quantity: string;
  amount: string;
}

const generateInvoice = (invoiceData: InvoiceFields, invoiceNumber: string) => {
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
};

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
    rowTotals.push(Number(e.quantity) * Number(e.amount));
  });
  return rowTotals;
}

function generateRowedItems(items: ItemFields[]) {
  const allRowedItems: Array<Array<string>> = [];

  // ? row item schema = ["Product or service name", "2", "$450", "$1000"],
  items.forEach((item) => {
    const rowTotal = Number(item.quantity) * Number(item.amount);
    allRowedItems.push([
      item.name,
      item.quantity,
      "$" + item.amount,
      "$" + rowTotal.toString(),
    ]);
  });

  return allRowedItems;
}

let baseInvoiceNumber = "0779";
const fromDetails =
  "Daniel Lee \ndanielleemusic98@gmail.com \nPhone: 0422 820 583 \nABN: 36120849966";
const notesDetails =
  "Payment VIA direct deposit \nBSB: 944600 \nACC: 016778510";
const termsDetails =
  "NOTE: PLEASE QUOTE YOUR INVOICE NUMBER IN YOUR PAYMENT STATEMENT. THE SYSTEM DETECTS YOUR PAYMENT WITH THIS NUMBER.";

const peopleToInvoice: InvoiceFields[] = [
  {
    from: fromDetails,
    to: "Mel Smith",
    items: [{ name: "Music Lesson - 1 Hour", quantity: "1", amount: "60" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Ainsley McLennan",
    items: [{ name: "Music Lesson - 1 Hour", quantity: "1", amount: "55" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Campbell Spratt",
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", amount: "30" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Sam Fitch",
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", amount: "30" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Dash Crowther",
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", amount: "30" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Lukas Venix",
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", amount: "30" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Jack Gempton",
    items: [{ name: "Music Lesson - 1 hour", quantity: "1", amount: "56" }],
    notes: notesDetails,
    terms: termsDetails,
  },
];

const testUser: InvoiceFields = {
  from: fromDetails,
  to: "Billy bob",
  items: [
    { name: "Music Lesson - 1 Hour", quantity: "1", amount: "60" },
    { name: "Music Lesson - 1 Hour", quantity: "5", amount: "89.67" },
    { name: "Hinga hjret", quantity: "4", amount: "81.49" },
  ],
  notes: notesDetails,
  terms: termsDetails,
};

const testArray: InvoiceFields[] = [
  {
    from: fromDetails,
    to: "Billy bob",
    items: [
      { name: "Music Lesson - 1 Hour", quantity: "1", amount: "60" },
      { name: "Music Lesson - 1 Hour", quantity: "5", amount: "89.67" },
      { name: "Hinga hjret", quantity: "4", amount: "81.49" },
    ],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "rodger mac",
    items: [
      { name: "Margret thatcher", quantity: "8", amount: "21.99" },
      { name: "Logi maji", quantity: "15", amount: "34.51" },
    ],
    notes: notesDetails,
    terms: termsDetails,
  },
];

export function createAllInvoices() {
  // peopleToInvoice.forEach((personsData) => {
  //   generateInvoiceRequest(personsData);
  // });
  generateInvoice(testUser, baseInvoiceNumber);
}

/*






*/
const idealPeopleToInvoice = [
  {
    from: fromDetails,
    to: "Mitch Haywood",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 1 Hour", quantity: "1", unit_cost: "55" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Mel Smith",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 1 Hour", quantity: "1", unit_cost: "60" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Gus Pearce",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 1 Hour", quantity: "1", unit_cost: "58" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Ainsley McLennan",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 1 Hour", quantity: "1", unit_cost: "55" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Campbell Spratt",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", unit_cost: "30" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Campbell Robertson",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", unit_cost: "30" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Sam Fitch",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", unit_cost: "30" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Dash Crowther",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", unit_cost: "30" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Lukas Venix",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", unit_cost: "30" }],
    notes: notesDetails,
    terms: termsDetails,
  },
  {
    from: fromDetails,
    to: "Jack Gempton",
    number: baseInvoiceNumber,
    items: [{ name: "Music Lesson - 30 mins", quantity: "1", unit_cost: "32" }],
    notes: notesDetails,
    terms: termsDetails,
  },
];
