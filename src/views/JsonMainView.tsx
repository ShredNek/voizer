import { Form, Container } from "react-bootstrap";
import { useState } from "react";
import { downloadInvoices, emailInvoices } from "../invoiceGenerationLogic";
import { Convert } from "../parseUserJson";
import GenerateOrEmailButtons from "../components/GenerateOrEmailButtons";

export default function JsonMainView() {
  const [userJson, setUserJson] = useState("");

  function parseUserJson() {
    return Convert.toInvoices(userJson);
  }

  function handleUserInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUserJson(() => e.target.value);
  }

  return (
    <section id="invoice-main-view">
      <h2 className="my-4 text-center">Place in your own JSON...</h2>
      <Container>
        <Form>
          <Form.Group>
            <Form.Label>JSON input</Form.Label>
            <Form.Control
              as="textarea"
              rows={7}
              className="textarea-height tall"
              value={userJson}
              onChange={handleUserInput}
            ></Form.Control>
          </Form.Group>
        </Form>
      </Container>
      <p className="my-4 text-center grey-text">
        (It is reccomended that you test how your input reflects in the invoices
        by generating them first.)
      </p>
      <GenerateOrEmailButtons
        DownloadInvoices={() => downloadInvoices(parseUserJson())}
        EmailInvoices={() => emailInvoices(parseUserJson())}
      />
    </section>
  );
}
