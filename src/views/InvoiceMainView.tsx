import { Form, Container, Button } from "react-bootstrap";
import * as Utils from "../utils";
import { useState, useRef } from "react";
import RecipientChild from "../components/RecipientChild";
import InvoiceSenderDetails from "../components/InvoiceSenderDetails";
import GenerateOrEmailButtons from "../components/GenerateOrEmailButtons";
import {
  downloadInvoices,
  emailInvoices,
  createInvoiceJsonFromUserInput,
  downloadOrEmail,
} from "../invoiceGenerationLogic";

export default function InvoiceMainView() {
  const [allRecipientChildKeys, setAllRecipientChildKeys] = useState<number[]>(
    []
  );
  const [invoiceItemsAndKeys, setItemServiceAmountsAndKeys] = useState<
    Utils.InvoiceItemsAndKey[]
  >([]);
  const [initialInvoiceNumber, setInitialInvoiceNumber] = useState("0001");
  const [invoiceProcessMethod, setInvoiceProcessMethod] =
    useState<downloadOrEmail>("download");
  const [validated, setValidated] = useState(false);
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (e.currentTarget.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setValidated(true);

    const json = createInvoiceJsonFromUserInput({
      recipientParentRef,
      invoiceSenderDetailsRef,
    });

    switch (invoiceProcessMethod) {
      case "download":
        downloadInvoices(json);
        break;
      case "email":
        emailInvoices(json);
        location.reload();
        break;
    }
  }

  function handleInvoiceNumberChange(newInvoiceNumber: string) {
    setInitialInvoiceNumber(() => newInvoiceNumber);
  }

  return (
    <section id="invoice-main-view">
      <h2 className="my-4 text-center">Let's send some invoices!</h2>

      <Container>
        <Form noValidate onSubmit={handleSubmit} validated={validated}>
          <h4>Invoice sender's details:</h4>
          <div ref={invoiceSenderDetailsRef}>
            <InvoiceSenderDetails
              bubbleUpInitialInvoiceNumber={handleInvoiceNumberChange}
            />
          </div>
          <div className="divider" />
          <h4 className="my-4">
            Please enter the details of each recipient below...
          </h4>
          <div id="all-recipients" ref={recipientParentRef}>
            <RecipientChild
              key={1}
              invoiceNumberAsString={Utils.prependZeroes(initialInvoiceNumber)}
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
          <Button variant="success" onClick={handleAddRecipientChild}>
            + Add recipient
          </Button>
          <GenerateOrEmailButtons
            DownloadInvoices={() => setInvoiceProcessMethod("download")}
            EmailInvoices={() => setInvoiceProcessMethod("email")}
          />
        </Form>
      </Container>
    </section>
  );
}
