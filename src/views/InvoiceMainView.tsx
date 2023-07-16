import { Form, Container, Button } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";

import { prependZeroes, incrementKey } from "../logic/utils";
import {
  downloadInvoices,
  emailInvoices,
  createInvoiceJsonFromManualInputAndDetectSpam,
  recalculateInvoiceNumbersOnRecipientChildren,
} from "../logic/invoiceGenerationLogic";
import {
  InvoiceSenderDetailsState,
  invoiceReturnMethod,
  InvoiceRecipientDetailsState,
} from "../../interfaces/invoices";

import RecipientChild from "../components/RecipientChild";
import InvoiceSenderDetails from "../components/InvoiceSenderDetails";
import GenerateOrEmailButtons from "../components/GenerateOrEmailButtons";

export default function InvoiceMainView() {
  const defaultInvNumber = "0001";

  const [invoiceSenderDetailsState, setInvoiceSenderDetailsState] = useState({
    name: "",
    email: "",
    contactNumber: "",
    businessNumber: "",
    notes: "",
    baseInvoiceNumber: defaultInvNumber,
  } as InvoiceSenderDetailsState);

  const [invoiceRecipientState, setInvoiceRecipientState] = useState([
    {
      name: "",
      email: "",
      address: "",
      invoiceNumber: defaultInvNumber,
      invoiceTotal: 0,
      items: [{ itemName: "", quantity: "", rate: "", key: "1" }],
    },
  ] as InvoiceRecipientDetailsState[]);

  const [validated, setValidated] = useState(false);
  const invoiceProcessMethod = useRef<invoiceReturnMethod>("download");
  const formRef = useRef<HTMLFormElement>(null);
  let buttonIsActive = useRef(true);

  function handleInvoiceSenderState(state: InvoiceSenderDetailsState) {
    const recalculatedInvNumRecipients =
      recalculateInvoiceNumbersOnRecipientChildren(
        invoiceRecipientState,
        state.baseInvoiceNumber
      );

    setInvoiceSenderDetailsState(() => state);
    setInvoiceRecipientState(() => recalculatedInvNumRecipients);
  }

  function handleAddRecipientChild() {
    let nextLargestRecipientId = "";

    if (invoiceRecipientState.length >= 1) {
      const priorKeys = invoiceRecipientState.map((i) => {
        return i.invoiceNumber;
      });
      nextLargestRecipientId = incrementKey(priorKeys);
    } else {
      nextLargestRecipientId = incrementKey([
        invoiceSenderDetailsState.baseInvoiceNumber,
      ]);
    }

    setInvoiceRecipientState([
      ...invoiceRecipientState,
      {
        address: "",
        items: [
          {
            itemName: "",
            quantity: "",
            rate: "",
            // ? Because this is the first row of the child,
            // ? it will always be 1
            key: "1",
          },
        ],
        invoiceTotal: 0,
        invoiceNumber: prependZeroes(nextLargestRecipientId),
        name: "",
        email: "",
      },
    ]);
  }

  function updateRecipientsOnChange(recipient: InvoiceRecipientDetailsState) {
    const arrayExcludingChangedRecipient = invoiceRecipientState.filter(
      (i) => i.invoiceNumber !== recipient.invoiceNumber
    );

    const sortedRecipients = [
      ...arrayExcludingChangedRecipient,
      recipient,
    ].sort((a, b) => Number(a.invoiceNumber) - Number(b.invoiceNumber));

    setInvoiceRecipientState(() => sortedRecipients);
  }

  function handleRecipientChildDeletion(invoiceNumber: string) {
    const arrayWithoutDeletedItem = invoiceRecipientState.filter(
      (i) => i.invoiceNumber !== invoiceNumber
    );

    setInvoiceRecipientState(() => [...arrayWithoutDeletedItem]);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    buttonIsActive.current = false;

    // if (e.currentTarget.checkValidity() === false) {
    //   e.stopPropagation();
    //   setValidated(true);
    //   buttonIsActive.current = true;
    //   return;
    // }
    // setValidated(false);

    const json = createInvoiceJsonFromManualInputAndDetectSpam({
      invoiceSenderDetailsState,
      invoiceRecipientState,
    });

    if (!json) {
      setValidated(true);
      buttonIsActive.current = true;
      return;
    }

    // ? sets other aspects of the form to default
    console.log("wiping");
    setInvoiceSenderDetailsState({
      name: "",
      email: "",
      contactNumber: "",
      businessNumber: "",
      notes: "",
      baseInvoiceNumber: defaultInvNumber,
    });

    setInvoiceRecipientState([
      {
        name: "",
        email: "",
        address: "",
        invoiceNumber: defaultInvNumber,
        invoiceTotal: 0,
        items: [{ itemName: "", quantity: "", rate: "", key: "1" }],
      },
    ]);

    // ? filthiest of hacks because state is fucking cancer
    setTimeout(() => {
      setInvoiceSenderDetailsState({
        name: "",
        email: "",
        contactNumber: "",
        businessNumber: "",
        notes: "",
        baseInvoiceNumber: defaultInvNumber,
      });

      setInvoiceRecipientState([
        {
          name: "",
          email: "",
          address: "",
          invoiceNumber: defaultInvNumber,
          invoiceTotal: 0,
          items: [{ itemName: "", quantity: "", rate: "", key: "1" }],
        },
      ]);
    }, 1000);

    switch (invoiceProcessMethod.current) {
      case "download":
        downloadInvoices(json);
        break;
      case "email":
        emailInvoices(json);
        break;
    }

    buttonIsActive.current = true;
  }

  useEffect(() => {
    //  ?
    //  ? This is where the default state of the invoices is set
    //  ?
    setInvoiceSenderDetailsState({
      name: "",
      email: "",
      contactNumber: "",
      businessNumber: "",
      notes: "",
      baseInvoiceNumber: defaultInvNumber,
    });

    setInvoiceRecipientState([
      {
        name: "",
        email: "",
        address: "",
        invoiceNumber: defaultInvNumber,
        invoiceTotal: 0,
        items: [{ itemName: "", quantity: "", rate: "", key: "1" }],
      },
    ]);
  }, []);

  useEffect(() => {
    console.log(invoiceSenderDetailsState);
    console.log(invoiceRecipientState);
  }, [invoiceSenderDetailsState, invoiceRecipientState]);

  return (
    <section>
      <h2 className="my-4 text-center">Let's send some invoices!</h2>
      <Container>
        <Form
          noValidate
          onSubmit={handleSubmit}
          validated={validated}
          ref={formRef}
        >
          <h4>Invoice sender's details:</h4>
          <div>
            <InvoiceSenderDetails
              onChange={handleInvoiceSenderState}
              initialDetails={invoiceSenderDetailsState}
            />
          </div>
          <div className="divider" />
          <h4 className="my-4">
            Please enter the details of each recipient below...
          </h4>
          <div id="all-recipients">
            {invoiceRecipientState.length >= 1
              ? invoiceRecipientState.map((recipient, index) => {
                  return (
                    <RecipientChild
                      key={recipient.invoiceNumber}
                      firstChild={index === 0 ? true : false}
                      recipientProps={recipient}
                      deleteThisChild={handleRecipientChildDeletion}
                      bubbleUpRecipientState={updateRecipientsOnChange}
                    />
                  );
                })
              : null}
          </div>
          <Button variant="success" onClick={handleAddRecipientChild}>
            + Add recipient
          </Button>
          <GenerateOrEmailButtons
            active={buttonIsActive.current}
            formRef={formRef}
            DownloadInvoices={() => (invoiceProcessMethod.current = "download")}
            EmailInvoices={() => (invoiceProcessMethod.current = "email")}
          />
        </Form>
      </Container>
    </section>
  );
}
