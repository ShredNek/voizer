import { Form, Container } from "react-bootstrap";
import { useState, useRef } from "react";
import {
  handleAllInvoices,
  generateInvoiceJsonFromJsonInputAndDetectSpam,
  jsonPlaceholder,
} from "../logic/invoiceGenerationLogic";
import { Convert } from "../logic/parseFromUserInput";
import { invoiceReturnMethod } from "../../interfaces/invoices";
import { RecipientStatuses } from './../../interfaces/emails';

import GenerateOrEmailButtons from "../components/GenerateOrEmailButtons";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertParent from '../components/AlertParent';

export default function JsonMainView() {
  const [userInput, setUserInput] = useState("");
  const [uiIsAccessible, setUiIsAccessible] = useState(true);
  const [recipientStatuses, setRecipientStatuses] = useState({} as RecipientStatuses)

  const invoiceProcessMethod = useRef<invoiceReturnMethod>("download");
  const formRef = useRef<HTMLFormElement>(null);
  let inputAbidesJsonFormat = useRef<boolean>(false);
  const jsonInputId = "json-input";

  function handleUserInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUserInput(() => e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (inputAbidesJsonFormat) {
      try {
        const parsedInput = Convert.toUserInput(userInput);

        const invoiceJson =
          generateInvoiceJsonFromJsonInputAndDetectSpam(parsedInput);

        switch (invoiceProcessMethod.current) {
          case "download":
            if (invoiceJson) handleAllInvoices(invoiceJson, "download");
            break;
          case "email":
            if (invoiceJson) {
              setUiIsAccessible(false);
              setUserInput('')
              setRecipientStatuses(await handleAllInvoices(
                invoiceJson,
                "email"
              ));
              setUiIsAccessible(true);
            }
            break;
        }
      } catch (err) {
        console.error(err);
        setUiIsAccessible(true);
      }
    }
  }

  function handleFormChange() {
    let val = "";
    try {
      const input = formRef.current?.getElementsByTagName("textarea");
      if (input) {
        [...input].forEach((e) =>
          e.id === jsonInputId ? (val = e.value) : null
        );
      }

      JSON.parse(val);
      inputAbidesJsonFormat.current = true;
    } catch {
      console.error("invalid json");
      inputAbidesJsonFormat.current = false;
    }
  }

  return (
    <div className="page-content-parent">
      <AlertParent recipientStatuses={recipientStatuses} />
      <LoadingSpinner isActive={!uiIsAccessible} />
      <section className={uiIsAccessible ? "" : "blurred"}>
        <Container>
          <h2 className="my-4 text-center">Place in your own JSON...</h2>
          <Form
            onSubmit={handleSubmit}
            ref={formRef}
            onChange={handleFormChange}
          >
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
              It is recommended that you test how your input reflects in the
              invoices by generating them first.
            </p>
            <div className="divider" />
            <GenerateOrEmailButtons
              active={uiIsAccessible && inputAbidesJsonFormat.current}
              formRef={formRef}
              DownloadInvoices={() =>
                (invoiceProcessMethod.current = "download")
              }
              EmailInvoices={() => (invoiceProcessMethod.current = "email")}
            />
          </Form>
        </Container>
      </section>
    </div>
  );
}
