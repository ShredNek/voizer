import { Form, Container, Button } from "react-bootstrap";
import RecipientChildren from "./RecipientChildren";
import InvoiceSenderDetails from "./InvoiceSenderDetails";

export default function InvoiceMainView() {
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
          <div id="all-recipients">
            <RecipientChildren key={1} />
          </div>
        </Form>
        <Button variant="success">+ Add recipient</Button>
      </Container>
      <Container className="center-children my-5">
        <Button variant="outline-primary" size={"lg"} className="mx-5">
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
