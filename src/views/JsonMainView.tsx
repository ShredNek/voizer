import { Form, Container } from "react-bootstrap";
import { useState, useRef } from "react";
import {
  downloadInvoices,
  emailInvoices,
  generateInvoiceJsonFromJsonInput,
  jsonPlaceholder,
} from "../logic/invoiceGenerationLogic";
import { Convert } from "../logic/parseFromUserInput";
import GenerateOrEmailButtons from "../components/GenerateOrEmailButtons";
import { invoiceReturnMethod } from "../../interfaces/invoices";

export default function JsonMainView() {
  const [userInput, setUserInput] = useState("");
  const [active, setActive] = useState(false);
  const invoiceProcessMethod = useRef<invoiceReturnMethod>("download");
  const formRef = useRef<HTMLFormElement>(null);

  function handleUserInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUserInput(() => e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsedInput = Convert.toUserInput(userInput);

    const invoiceJson = generateInvoiceJsonFromJsonInput(parsedInput);
    switch (invoiceProcessMethod.current) {
      case "download":
        if (invoiceJson) downloadInvoices(invoiceJson);
        break;
      case "email":
        if (invoiceJson) emailInvoices(invoiceJson);
        break;
    }
  }

  const jsonInputId = "json-input";

  function handleFormChange() {
    setActive(true);

    let val = "";
    try {
      const input = formRef.current?.getElementsByTagName("textarea");
      if (input) {
        [...input].forEach((e) =>
          e.id === jsonInputId ? (val = e.value) : null
        );
      }

      JSON.parse(val);
    } catch {
      // console.error("invalid json");
      setActive(false);
    }
    if (active) {
      // console.log("all good");
    }
  }

  return (
    <section>
      <Container>
        <h2 className="my-4 text-center">Place in your own JSON...</h2>
        <Form onSubmit={handleSubmit} ref={formRef} onChange={handleFormChange}>
          <Form.Group>
            <Form.Label>JSON input</Form.Label>
            <Form.Control
              id={jsonInputId}
              as="textarea"
              rows={7}
              className="textarea-height tall"
              value={userInput}
              onChange={handleUserInput}
              placeholder={
                "Example input: \n" + JSON.stringify(jsonPlaceholder, null, 2)
              }
            ></Form.Control>
          </Form.Group>
          <div className="divider" />
          <p className="my-4 text-center red-text">
            Please,{" "}
            <strong>
              DO NOT include multiple entries within the "students" array that
              contain the same email the same email.{" "}
            </strong>
            your entire json will be treated as spam and will not be parsed by
            the program.
          </p>
          <div className="divider" />
          <p className="my-4 text-center grey-text">
            It is recomended that you test how your input reflects in the
            invoices by generating them first.
          </p>
          <div className="divider" />
          <GenerateOrEmailButtons
            active={active}
            formRef={formRef}
            DownloadInvoices={() => (invoiceProcessMethod.current = "download")}
            EmailInvoices={() => (invoiceProcessMethod.current = "email")}
          />
        </Form>
      </Container>
    </section>
  );
}
