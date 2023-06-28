import { Dispatch, SetStateAction } from "react";

export type numbsThatArePotentiallyNull = number | null;

export interface childAmountAndKey {
  amount: number;
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
  totalAmounts: childAmountAndKey[]
) {
  let keyIsPresent = false;
  totalAmounts.forEach((e) => {
    if (e.key === key) keyIsPresent = true;
    return;
  });
  return keyIsPresent;
}

export function getByKeyAndCallbackSetState(
  key: number,
  amount: number,
  totalAmounts: childAmountAndKey[],
  setStateCallback: Dispatch<SetStateAction<childAmountAndKey[]>>
) {
  let newTotalAmount: childAmountAndKey[] = [];
  totalAmounts.forEach((e) => {
    if (e.key !== key) {
      newTotalAmount.push(e);
      return;
    }
    newTotalAmount.push({ amount, key });
    setStateCallback(newTotalAmount);
  });
}

export function removeByKeyAndCallbackSetState(
  key: number,
  totalAmounts: childAmountAndKey[],
  setStateCallback: Dispatch<SetStateAction<childAmountAndKey[]>>
) {
  let newTotalAmount: childAmountAndKey[] = [];
  totalAmounts.forEach((e) => {
    if (e.key !== key) {
      newTotalAmount.push(e);
      return;
    }
    setStateCallback(newTotalAmount);
  });
}

export function incrementId(priorIds: number[]) {
  return Math.max(...priorIds) + 1;
}

export default {};
