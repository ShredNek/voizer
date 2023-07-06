import { Form, Container, Button } from "react-bootstrap";
import * as Utils from "../utils";
import { useState, useRef } from "react";
import RecipientChild from "../components/RecipientChild";
import InvoiceSenderDetails from "../components/InvoiceSenderDetails";
import GenerateOrEmailButtons from "../components/GenerateOrEmailButtons";
import {
  InvoiceFields,
  InvoiceItemFields,
  PersonalDetails,
} from "../../interfaces/invoices";
import { downloadInvoices, emailInvoices } from "../invoiceGenerationLogic";

export default function InvoiceMainView() {
  const [allRecipientChildKeys, setAllRecipientChildKeys] = useState<number[]>(
    []
  );
  const [invoiceItemsAndKeys, setItemServiceAmountsAndKeys] = useState<
    Utils.InvoiceItemsAndKey[]
  >([]);
  const [initialInvoiceNumber, setInitialInvoiceNumber] = useState("0001");
  const recipientParentRef = useRef<HTMLDivElement>(null);
  const invoiceSenderDetailsRef = useRef<HTMLDivElement>(null);

  function handleAddRecipientChild() {
    if (allRecipientChildKeys.length !== 0) {
      const numbToAdd = Utils.incrementId(allRecipientChildKeys);
      setAllRecipientChildKeys([...allRecipientChildKeys, numbToAdd]);
      return;
    }
    setAllRecipientChildKeys([0]);
  }

  function handleRecipientChildDeletion(key: number) {
    Utils.deleteKeyAndCallbackSetState(
      key,
      allRecipientChildKeys,
      setAllRecipientChildKeys
    );
    // ? handles the deletion of a RecipientChild row

    Utils.removeByKeyAndCallbackSetState(
      key,
      invoiceItemsAndKeys,
      setItemServiceAmountsAndKeys
    );
  }

  // TODO: shorten this overblown function
  function createInvoices() {
    const whatWeWorkingWith =
      recipientParentRef.current?.getElementsByClassName(
        "reactive-recipient-children"
      );

    let allCreatedInvoices: InvoiceFields[] = [];

    const invoiceSenderInputs =
      invoiceSenderDetailsRef.current?.getElementsByTagName("input");

    let invoiceSenderDetails = {} as PersonalDetails;
    let invoiceSenderNotes = "";

    const invoiceSenderTextareas =
      invoiceSenderDetailsRef.current?.getElementsByTagName("textarea");

    if (invoiceSenderTextareas) {
      const other = [...invoiceSenderTextareas];
      other.forEach((e) => {
        switch (e.id) {
          case "notes":
            invoiceSenderNotes = e.value;
            break;
        }
      });
    }

    if (invoiceSenderInputs) {
      const fuJs = [...invoiceSenderInputs];
      fuJs.forEach((e) => {
        switch (e.id) {
          case "name":
            invoiceSenderDetails.name = e.value;
            break;
          case "email":
            invoiceSenderDetails.email = e.value;
            break;
          case "number":
            invoiceSenderDetails.number = e.value;
            break;
          case "business-number":
            invoiceSenderDetails.businessNumber = e.value;
            break;
        }
      });
    }

    if (whatWeWorkingWith) {
      const allRecipients = [...whatWeWorkingWith];
      allRecipients.forEach((e) => {
        let recipientObject = {} as InvoiceFields;

        // ? the id of the child is it's invoice number
        recipientObject.invoiceNumber = e.id;
        recipientObject.notes = invoiceSenderNotes;
        recipientObject.from = invoiceSenderDetails;
        recipientObject.to = {} as PersonalDetails;
        recipientObject.items = [];

        // ? This confusing use of the spread syntax is to immediately convert
        // ? from an html collection to an array
        const allInputElems = [...e.getElementsByTagName("input")];
        // ? and this is to find each by their id and sort them into the object
        allInputElems.forEach((e) => {
          switch (e.id) {
            case "name":
              recipientObject.to.name = e.value;
              break;
            case "email":
              recipientObject.to.email = e.value;
              break;
          }
          // TODO TAKE THE REST OF THE DATA FORM THE CHILD
        });

        const allItemRowsElems = [
          ...e.getElementsByClassName("invoiced-items-rows"),
        ];

        // TODO - refactor this bulky code
        allItemRowsElems.forEach((e) => {
          const inputElemsOfItems = [...e.getElementsByTagName("input")];

          let rowedItem = {} as InvoiceItemFields;
          inputElemsOfItems.forEach((e) => {
            switch (e.id) {
              case "item-name":
                rowedItem.itemName = e.value;
                break;
              case "quantity":
                rowedItem.quantity = e.value;
                break;
              case "rate":
                rowedItem.rate = e.value;
                break;
            }
          });

          recipientObject.items.push(rowedItem);
        });

        allCreatedInvoices.push(recipientObject);
      });
    }

    console.log(allCreatedInvoices);
    return allCreatedInvoices;
  }

  return (
    <section id="invoice-main-view">
      <h2 className="my-4 text-center">Let's send some invoices!</h2>

      <Container>
        <Form>
          <h4>Invoice sender's details:</h4>
          <div ref={invoiceSenderDetailsRef}>
            <InvoiceSenderDetails
              bubbleUpInitialInvoiceNumber={(newInvoiceNumber) =>
                setInitialInvoiceNumber(() => newInvoiceNumber)
              }
            />
          </div>
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
                      invoiceNumberAsString={Utils.convertToInvoiceNumberAsString(
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
      <GenerateOrEmailButtons
        EmailInvoices={() => emailInvoices(createInvoices())}
        DownloadInvoices={() => downloadInvoices(createInvoices())}
      />
    </section>
  );
}
