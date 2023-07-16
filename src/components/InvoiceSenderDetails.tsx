import { Form, Row, Col, InputGroup, FloatingLabel } from "react-bootstrap";
import { InvoiceSenderDetailsState } from "../../interfaces/invoices";

interface InvoiceSenderDetails {
  initialDetails: InvoiceSenderDetailsState;
  onChange: (state: InvoiceSenderDetailsState) => void;
}

export default function InvoiceSenderDetails({
  initialDetails,
  onChange,
}: InvoiceSenderDetails) {
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    onChange({
      ...initialDetails,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div id="invoice-sender-details">
      <Row>
        <Col md={{ span: 6 }} xs={{ span: 12 }}>
          <Form.Group>
            <FloatingLabel className="my-2" label="Full Name">
              <Form.Control
                autoComplete="true"
                required
                type="name"
                name="name"
                placeholder="Full Name"
                value={initialDetails.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Please enter your name
              </Form.Control.Feedback>
            </FloatingLabel>
          </Form.Group>
        </Col>
        <Col md={{ span: 6 }} xs={{ span: 12 }}>
          <Form.Group>
            <FloatingLabel className="my-2" label="Email">
              <Form.Control
                required
                autoComplete="true"
                type="email"
                name="email"
                placeholder="Email"
                value={initialDetails.email}
                onChange={handleChange}
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
        <Col md={{ span: 6 }} xs={{ span: 12 }}>
          <Form.Group>
            <FloatingLabel className="my-2" label="Contact Number">
              <Form.Control
                autoComplete="true"
                type="number"
                name="contactNumber"
                placeholder="Contact Number"
                value={initialDetails.contactNumber}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Form.Group>
        </Col>
        <Col md={{ span: 6 }} xs={{ span: 12 }}>
          <Form.Group>
            <FloatingLabel className="my-2" label="Business Number">
              <Form.Control
                type="number"
                placeholder="i.e. If Australian, write your ABN"
                name="businessNumber"
                value={initialDetails.businessNumber}
                onChange={handleChange}
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
              name="notes"
              className="textarea-height short"
              value={initialDetails.notes}
              onChange={handleChange}
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
              name="baseInvoiceNumber"
              placeholder="0001"
              value={initialDetails.baseInvoiceNumber}
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
