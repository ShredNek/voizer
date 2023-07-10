import { Form, Row, Col, InputGroup, FloatingLabel } from "react-bootstrap";
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
            <FloatingLabel className="my-2" label="Full Name">
              <Form.Control
                required
                type="name"
                id="name"
                placeholder="Full Name"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Please enter your name
              </Form.Control.Feedback>
            </FloatingLabel>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <FloatingLabel className="my-2" label="Email">
              <Form.Control
                required
                type="email"
                id="email"
                placeholder="Email"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Please enter your email
              </Form.Control.Feedback>
            </FloatingLabel>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <FloatingLabel className="my-2" label="Contact Number">
              <Form.Control
                type="number"
                id="number"
                placeholder="Contact Number"
              />
            </FloatingLabel>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <FloatingLabel className="my-2" label="Business Number">
              <Form.Control
                type="number"
                placeholder="i.e. If Australian, write your ABN"
                id="business-number"
              />
            </FloatingLabel>
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
              className="textarea-height short"
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
              required
              type="number"
              placeholder="0001"
              defaultValue={"0001"}
              onChange={handleChange}
              min={1}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              Please enter a positive number
            </Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
}
