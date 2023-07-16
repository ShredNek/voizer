import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import font from "../assets/misc/Urbanist.js";
import {
  sendEmail,
  getDateAfterOneWeek,
  convertToInvoiceNumberAsString,
  hasDuplicateStrings,
  prependZeroes,
} from "./utils.ts";
import { EmailEndpointParameter } from "../../interfaces/emails.ts";
import {
  InvoiceFields,
  InvoiceItemFields,
  PersonalDetails,
  invoiceReturnMethod,
  UserInput,
  Client,
  InvoiceSenderDetailsState,
  InvoiceRecipientDetailsState,
  InvoiceRecipientItemState,
} from "../../interfaces/invoices.ts";

// ? INTERNAL INTERFACES ?

interface StatesFromManualInput {
  invoiceSenderDetailsState: InvoiceSenderDetailsState;
  invoiceRecipientState: InvoiceRecipientDetailsState[];
}

// ? EXPORTED FUNCTIONS ?

export const jsonPlaceholder = {
  baseNumber: "1998",
  senderDetails: {
    name: "Daniel",
    email: "daniel@test.com",
    number: "123456789",
    businessNumber: "ABN: 123456789",
  },
  students: [
    {
      name: "Jane Doe",
      email: "janedoe@test.com",
      items: [
        {
          itemName: "Music Lesson - 30 mins",
          quantity: "1",
          rate: "30",
        },
      ],
    },
    {
      name: "John Smith",
      email: "johnsmith@test.com",
      items: [
        {
          itemName: "Music Lesson - 1 hour",
          quantity: "1",
          rate: "60",
        },
      ],
    },
  ],
  notes: "Payment VIA direct deposit \nBSB: 12456\nACC: 123456789",
};

export function recalculateInvoiceTotal(items: InvoiceRecipientItemState[]) {
  const amounts: number[] = items.map((item) => {
    return Number(item.quantity) * Number(item.rate);
  });

  return amounts.reduce((prev, curr) => prev + curr, 0);
}

export function recalculateInvoiceNumbersOnRecipientChildren(
  state: InvoiceRecipientDetailsState[],
  baseInvNum: string
) {
  return state.map((recipient, index) => ({
    ...recipient,
    invoiceNumber: prependZeroes((Number(baseInvNum) + index).toString()),
  }));
}

export function createInvoiceJsonFromManualInputAndDetectSpam({
  invoiceSenderDetailsState,
  invoiceRecipientState,
}: StatesFromManualInput) {
  let allCreatedInvoices: InvoiceFields[] = [];

  let invoiceSenderDetails: PersonalDetails = {
    name: invoiceSenderDetailsState.name,
    email: invoiceSenderDetailsState.email,
    contactNumber: invoiceSenderDetailsState.contactNumber,
    businessNumber: invoiceSenderDetailsState.businessNumber,
  };

  invoiceRecipientState.forEach((recipient) => {
    let allRecipientItems: InvoiceItemFields[] = recipient.items.map((item) => {
      return {
        itemName: item.itemName,
        quantity: item.quantity,
        rate: item.rate,
      };
    });

    let recipientObject: InvoiceFields = {
      from: invoiceSenderDetails,
      to: { name: recipient.name, email: recipient.email },
      items: allRecipientItems,
      notes: invoiceSenderDetailsState.notes,
      invoiceNumber: recipient.invoiceNumber,
    };

    allCreatedInvoices.push(recipientObject);
  });

  const allEmailAddresses = allCreatedInvoices.map((inv) => inv.to.email);

  return handleSpamWarning(
    !hasDuplicateStrings(allEmailAddresses),
    allCreatedInvoices
  );
}

export function generateInvoiceJsonFromJsonInputAndDetectSpam(
  userInput: UserInput
): InvoiceFields[] | void {
  let finalJson: InvoiceFields[] = [];

  userInput.students.forEach((student, iteration) => {
    let jsonItem = {
      invoiceNumber: convertToInvoiceNumberAsString(
        userInput.baseNumber,
        // ? I decreased the iteration by 1 to
        // ? include the first invoice in the array
        iteration - 1
      ),
      notes: userInput.notes,
      from: userInput.senderDetails,
      to: { name: student.name, email: student.email },
      items: student.items,
    } as InvoiceFields;

    finalJson.push(jsonItem);
  });

  return handleSpamWarning(
    !checkForDuplicateEmails(userInput.students),
    finalJson
  );
}

export function generateInvoicePdf(
  invoiceData: InvoiceFields,
  returnMethod: invoiceReturnMethod
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
            invoiceData.invoiceNumber +
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
          content:
            "Billed to:" +
            "\n" +
            invoiceData.to.name +
            "\n" +
            invoiceData.to.email,
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
          content:
            "Billed from:" +
            "\n" +
            invoiceData.from.name +
            "\n" +
            invoiceData.from.email,
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
      // ! IF YOU WANT TO ADD TAX, UNCOMMENT THIS
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
          content: invoiceData.notes,
          styles: {
            halign: "left",
            font: "Urbanist",
          },
        },
      ],
    ],
    theme: "plain",
  });

  const pdfOutput = doc.output("datauristring");
  const base64 = pdfOutput.replace(
    /^data:application\/pdf;filename=generated.pdf;base64,/,
    ""
  );

  if (returnMethod === "download") {
    return doc.save(`INV#${invoiceData.invoiceNumber}`);
  } else if (returnMethod === "email") {
    return base64;
  }
}

export function downloadInvoices(allInvoices: InvoiceFields[] | undefined) {
  allInvoices ? handleAllInvoices(allInvoices, "download") : null;
}

export function emailInvoices(allInvoices: InvoiceFields[] | undefined) {
  allInvoices ? handleAllInvoices(allInvoices, "email") : null;
}

export function handleAllInvoices(
  allInvoices: InvoiceFields[],
  returnMethod: invoiceReturnMethod
) {
  allInvoices.forEach((invoice) => {
    if (returnMethod === "download") {
      generateInvoicePdf(invoice, returnMethod);
    } else if (returnMethod === "email") {
      const encodedInvoice = generateInvoicePdf(
        invoice,
        returnMethod
      ) as string;
      const emailArgs = {
        encodedInvoice,
        invoiceDetails: invoice,
      } as EmailEndpointParameter;
      sendEmail(emailArgs);
    }
  });
}

// ? INTERNAL FUNCTIONS ?

function generateInvoiceTotal(rowAmounts: number[]) {
  return rowAmounts
    .reduce((prev, curr) => {
      return (prev += curr);
    }, 0)
    .toFixed(2);
}

function generateInvoiceRowTotals(invoiceData: InvoiceFields) {
  let rowTotals: number[] = [];
  invoiceData.items.forEach((e) => {
    rowTotals.push(Number(e.quantity) * Number(e.rate));
  });
  return rowTotals;
}

function generateRowedItems(items: InvoiceItemFields[]) {
  const allRowedItems: Array<Array<string>> = [];

  // ? row item schema = ["Product or service name", "2", "$450", "$1000"],
  items.forEach((item) => {
    const rowTotal = Number(item.quantity) * Number(item.rate);
    allRowedItems.push([
      item.itemName,
      item.quantity,
      "$" + item.rate,
      "$" + rowTotal.toFixed(2),
    ]);
  });

  return allRowedItems;
}

function handleSpamWarning(any: boolean, returnVal: any) {
  const antiSpamWarningMsg =
    "We've detected multiple instances of the same email in your recipients. Please don't do that, and remove any duplicate emails to prevent your customers from getting spammed.";

  return any
    ? returnVal
    : (console.error(antiSpamWarningMsg), window.alert(antiSpamWarningMsg));
}

function checkForDuplicateEmails(students: Client[]): boolean {
  // ? to check that not one email is being spammed;
  let allEmails: string[] = [];
  students.forEach((student) => allEmails.push(student.email));
  return hasDuplicateStrings(allEmails);
}
