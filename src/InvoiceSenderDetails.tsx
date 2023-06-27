import { Form, Row, Col, InputGroup } from "react-bootstrap";

export default function InvoiceSenderDetails() {
  return (
    <div className="invoice-sender-details">
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="my-2">Full Name</Form.Label>
            <Form.Control type="full-name" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="my-2">Email</Form.Label>
            <Form.Control type="email" />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="my-2">Contact Number</Form.Label>
            <Form.Control type="number" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="my-2">Business Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="i.e. If Australian, write your ABN"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-2">
        <Col>
          <Form.Label>Initial invoice number?</Form.Label>
          <Form.Text className="mx-3">(Optional)</Form.Text>
          <InputGroup>
            <InputGroup.Text>INV#</InputGroup.Text>
            <Form.Control type="number" placeholder="0001"></Form.Control>
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
}
