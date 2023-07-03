import { Form, Container, Button } from "react-bootstrap";
import {
  keyIsInTotalAmounts,
  InvoiceItemsAndKey,
  InvoiceItem,
  getInvoiceItemByKeyAndCallbackSetState,
  deleteKeyAndCallbackSetState,
  removeByKeyAndCallbackSetState,
  incrementId,
  convertToInvoiceNumberAsString,
  checkIfStringIsOnlyWhitespace,
} from "./utils";
import { useState, useEffect, useRef } from "react";
import RecipientChild from "./RecipientChild";
import InvoiceSenderDetails from "./InvoiceSenderDetails";
import {
  InvoiceFields,
  ItemFields,
  createAllInvoices,
} from "./invoiceGenerationLogic";

export default function InvoiceMainView() {
  const [allRecipientChildKeys, setAllRecipientChildKeys] = useState<number[]>(
    []
  );
  const [invoiceItemsAndKeys, setItemServiceAmountsAndKeys] = useState<
    InvoiceItemsAndKey[]
  >([]);
  const [initialInvoiceNumber, setInitialInvoiceNumber] = useState("0098");
  const recipientParentRef = useRef<HTMLDivElement>(null);

  function handleAddRecipientChild() {
    if (allRecipientChildKeys.length !== 0) {
      const numbToAdd = incrementId(allRecipientChildKeys);
      setAllRecipientChildKeys([...allRecipientChildKeys, numbToAdd]);
      return;
    }
    setAllRecipientChildKeys([0]);
  }

  // ? this function must be used as the onChange callback,
  // ? to set the amount of key's respective amount in the
  // ? state item in the itemServiceAmountsAndKeys array
  function refreshServiceAmountUsingChildKey(
    invoiceItems: InvoiceItem[],
    key: number
  ) {
    if (!keyIsInTotalAmounts(key, invoiceItemsAndKeys)) {
      const newInvoiceItemAndKey = { invoiceItems, key };
      setItemServiceAmountsAndKeys([
        ...invoiceItemsAndKeys,
        newInvoiceItemAndKey,
      ]);
      return;
    }

    getInvoiceItemByKeyAndCallbackSetState(
      key,
      invoiceItems,
      invoiceItemsAndKeys,
      setItemServiceAmountsAndKeys
    );
  }

  // ? handles the deletion of a RecipientChild row
  function handleRecipientChildDeletion(key: number) {
    deleteKeyAndCallbackSetState(
      key,
      allRecipientChildKeys,
      setAllRecipientChildKeys
    );

    removeByKeyAndCallbackSetState(
      key,
      invoiceItemsAndKeys,
      setItemServiceAmountsAndKeys
    );
  }

  function handleGenerateInvoices() {
    const whatWeWorkingWith =
      recipientParentRef.current?.getElementsByClassName(
        "reactive-recipient-children"
      );

    let processedStuff: any[] = [];

    if (whatWeWorkingWith) {
      const allRecipients = [...whatWeWorkingWith];
      allRecipients.forEach((e) => {
        // ? This confusing use of the spread syntax is to immediately convert
        // ?from an html collection to an array
        const allInputKids = [...e.getElementsByTagName("input")];

        let recipientObject = {} as InvoiceFields;
        recipientObject.items = [];

        // ? and this is to find each by their id and sort them into the object
        allInputKids.forEach((e) => {
          if (e.id === "name") recipientObject.to = e.value;
          // TODO TAKE THE REST OF THE DATA FORM THE CHILD
        });

        const allItemRows = [
          ...e.getElementsByClassName("invoiced-items-rows"),
        ];

        allItemRows.forEach((e) => {
          const inputChildrenOfItems = [...e.getElementsByTagName("input")];

          let rowedItem: ItemFields = {} as ItemFields;
          let itemName = "";
          let quantity = "";
          let rate = "";
          inputChildrenOfItems.forEach((e) => {
            switch (e.id) {
              case "item-name":
                itemName = e.value;
                break;
              case "quantity":
                quantity = e.value;
                break;
              case "rate":
                rate = e.value;
                break;
            }
          });

          rowedItem = { name: itemName, quantity, rate };
          recipientObject.items.push(rowedItem);
        });

        processedStuff.push(recipientObject);
      });
    }

    console.log(processedStuff);
  }

  /*
  
  
  logic?

  change flag isLoading to true
  children bubble up their data, keyed with their invoice number
  
  ....

  or we could just loop through the entire page's inputs
  
  
  
  */
  return (
    <section id="invoice-main-view">
      <h2 className="my-4 text-center">Let's send some invoices!</h2>

      <Container>
        <Form>
          <h4>Invoice sender's details:</h4>
          <InvoiceSenderDetails />
          <div className="divider" />
          <h4 className="my-4">
            Please enter the details of each recipient below...
          </h4>
          <div id="all-recipients" ref={recipientParentRef}>
            <RecipientChild
              key={1}
              invoiceNumberAsString={initialInvoiceNumber}
              firstChild={true}
            />
            {allRecipientChildKeys
              ? allRecipientChildKeys.map((key) => {
                  return (
                    <RecipientChild
                      key={key}
                      invoiceNumberAsString={convertToInvoiceNumberAsString(
                        initialInvoiceNumber,
                        key
                      )}
                      deleteThisChild={() => handleRecipientChildDeletion(key)}
                    />
                  );
                })
              : null}
          </div>
        </Form>
        <Button variant="success" onClick={handleAddRecipientChild}>
          + Add recipient
        </Button>
      </Container>
      <Container className="center-children my-5">
        <Button
          variant="outline-primary"
          size={"lg"}
          className="mx-5"
          onClick={handleGenerateInvoices}
        >
          Generate invoices
        </Button>
        <Button variant="outline-success" size={"lg"} className="mx-5">
          Send all invoices
        </Button>
      </Container>
    </section>
  );
}

/* 
      
      what does the input look like?

      begin with senders 
        - name, 
        - address, 
        - number (optional), 
        - business number (optional)

      include optional initial invoice number (for multiple invoices)

      MARK EACH CHILD ELEM WITH INVOICE NUMBER AS INCREMETED FROM INITIAL NUMBER

      a list of children elems, each with a:
        - receiver full name
        - receiver email address
        - receiver physical address (if needed)
        - date (optional)
        - item name, quantity, rate
        - note & terms

      can choose to increase the list with a plus button beneath each entry


      
      */
