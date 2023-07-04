import { Form, Row, Col, InputGroup } from "react-bootstrap";
interface InvoiceSenderDetails {
  bubbleUpInitialInvoiceNumber: (str: string) => void;
}

export default function InvoiceSenderDetails({
  bubbleUpInitialInvoiceNumber,
}: InvoiceSenderDetails) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    return bubbleUpInitialInvoiceNumber(e.target.value);
  }
  return (
    <div id="invoice-sender-details">
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="my-2">Full Name</Form.Label>
            <Form.Control type="name" id="name" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="my-2">Email</Form.Label>
            <Form.Control type="email" id="email" />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="my-2">Contact Number</Form.Label>
            <Form.Control type="number" id="number" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="my-2">Business Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="i.e. If Australian, write your ABN"
              id="business-number"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="my-2">Notes for recipient</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="i.e. ACC no. & BSB, delivery should take 1 week..."
              id="notes"
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-2">
        <Col>
          <Form.Label>Initial invoice number</Form.Label>
          <InputGroup>
            <InputGroup.Text>INV#</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="0001"
              defaultValue={"0001"}
              onChange={handleChange}
            ></Form.Control>
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
}
