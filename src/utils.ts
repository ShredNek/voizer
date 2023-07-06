import { Dispatch, SetStateAction } from "react";
import { InvoiceFields, InvoiceItemFields } from "../interfaces/invoices.ts";
import axios from "axios";

export type numbsThatArePotentiallyNull = number | null;

export type allInterfacesWithKeys = AmountAndKey | InvoiceItemsAndKey;

export interface AmountAndKey {
  amount: number;
  key: number;
}
export interface InvoiceItemsAndKey {
  invoiceItems: InvoiceItemFields[];
  key: number;
}

export function handleIfQuantityOrRateIsNull(
  quantity: numbsThatArePotentiallyNull,
  rate: numbsThatArePotentiallyNull
) {
  let newTotal: number;
  quantity != null && rate != null
    ? (newTotal = quantity * rate)
    : (newTotal = 0);

  return newTotal;
}

export function keyIsInTotalAmounts(
  key: number,
  totalAmounts: AmountAndKey[] | InvoiceItemsAndKey[]
) {
  let keyIsPresent = false;
  totalAmounts.forEach((e) => {
    if (e.key === key) keyIsPresent = true;
    return;
  });
  return keyIsPresent;
}

export function getInvoiceItemByKeyAndCallbackSetState(
  key: number,
  invoiceItems: InvoiceItemFields[],
  childArray: InvoiceItemsAndKey[],
  setStateCallback: Dispatch<SetStateAction<InvoiceItemsAndKey[]>>
) {
  let newChildArray: InvoiceItemsAndKey[] = [];
  childArray.forEach((e) => {
    if (e.key !== key) {
      newChildArray.push(e);
    }
  });
  newChildArray.push({ invoiceItems, key } as InvoiceItemsAndKey);
  setStateCallback(newChildArray);
}

export function getAmountByKeyAndCallbackSetState(
  key: number,
  amount: number,
  childArray: AmountAndKey[],
  setStateCallback: Dispatch<SetStateAction<AmountAndKey[]>>
) {
  let newChildArray: AmountAndKey[] = [];
  childArray.forEach((e) => {
    if (e.key !== key) {
      newChildArray.push(e);
    }
  });
  newChildArray.push({ amount, key } as AmountAndKey);
  setStateCallback(newChildArray);
}

export function removeByKeyAndCallbackSetState<T extends allInterfacesWithKeys>(
  key: number,
  totalAmounts: T[],
  setStateCallback: Dispatch<SetStateAction<T[]>>
) {
  let newTotalAmount: T[] = [];
  totalAmounts.forEach((e) => {
    if (e.key !== key) {
      newTotalAmount.push(e);
    }
    setStateCallback(newTotalAmount as T[]);
  });
}

export function deleteKeyAndCallbackSetState(
  key: number,
  keyArray: number[],
  setStateCallback: Dispatch<SetStateAction<number[]>>
) {
  let newChildren: number[] = [];
  keyArray.forEach((n) => (n !== key ? newChildren.push(n) : null));
  setStateCallback(newChildren);
}

export function incrementId(priorIds: number[]) {
  return Math.max(...priorIds) + 1;
}

export function convertToInvoiceNumberAsString(
  initialInvoiceNumber: string,
  iteration: number
) {
  const defaultLengthOfInvoiceNumbers = 4;
  const initialInvoiceNumberOffset = 1;
  const numsAdded = (
    Number(initialInvoiceNumber) +
    iteration +
    initialInvoiceNumberOffset
  ).toString();

  if (numsAdded.length >= defaultLengthOfInvoiceNumbers) {
    return numsAdded;
  }

  let difference: number = defaultLengthOfInvoiceNumbers - numsAdded.length;
  let tempZeros = [];

  while (difference > 0) {
    tempZeros.push("0");
    difference--;
  }

  const ans = tempZeros.join("").concat(numsAdded);
  return ans;
}

export function checkIfStringIsOnlyWhitespace(string: string) {
  const whitespaceRegex = new RegExp("^s*$");
  return whitespaceRegex.test(string);
}

export function getTodaysDate() {
  return new Date().toISOString().split("T")[0];
}

const emailEndpoint = import.meta.env.VITE_EMAIL_ENDPOINT;

export async function sendEmail(
  encodedInvoice: string,
  invoiceDetails: InvoiceFields
) {
  axios
    .post(emailEndpoint, { encodedInvoice, invoiceDetails })
    .then(() => console.log("no error? wot"))
    .catch(() => console.log("nah we fucked up"));
}

export default {};
