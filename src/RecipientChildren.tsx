import { useState } from "react";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import InvoicedItemsServices from "./InvoicedItemsServices";

// interface RecipientChildrenInterface {
//   key: number;
// }

export default function RecipientChildren() {
  const [totalItemsServiceRowKeys, setTotalItemsServiceRowKeys] = useState([1]);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

  function incrementId(priorIds: number[]) {
    return Math.max(...priorIds) + 1;
  }

  function handleAddRow() {
    const numbToAdd = incrementId(totalItemsServiceRowKeys);
    setTotalItemsServiceRowKeys([...totalItemsServiceRowKeys, numbToAdd]);
  }

  function recalculateTotalAmount(amount: number) {
    console.log(amount);
  }

  return (
    <div className="reactive-recipient-children">
      <Row>
        <Col>
          <h4 className="mx-1">Recipient details</h4>
        </Col>
        <Col>
          <p>INV#0001</p>
        </Col>
      </Row>
      <Form.Group>
        <Row className="g-2">
          <Col>
            <FloatingLabel label="Full name">
              <Form.Control type="name" placeholder="John Smith" />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label="Email">
              <Form.Control type="email" placeholder="example@test.com" />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="g-2 my-1 mb-3">
          <Col md={{ span: 8 }}>
            <FloatingLabel label="Address (optional)">
              <Form.Control type="address" placeholder="John Smith" />
            </FloatingLabel>
          </Col>
          <Col md={{ span: 4 }}>
            <FloatingLabel label="Date (Optional)">
              <Form.Control type="address" placeholder="John Smith" />
            </FloatingLabel>
          </Col>
        </Row>
        <div className="divider white" />
        <h4 className="m-1">Invoiced items/services</h4>
        <div id="all-invoiced-amount-rows">
          {totalItemsServiceRowKeys.map((key) => {
            return (
              <InvoicedItemsServices
                key={key}
                bubbleUpTotalAmount={(amount: number) =>
                  recalculateTotalAmount(amount)
                }
              />
            );
          })}
        </div>
        <div className="total-amount">
          <Row className="g-2 my-1 mb-3">
            <Col
              md={{ span: 2, offset: 8 }}
              className="recipient-default-value"
            >
              <Form.Control value="TOTAL:" plaintext readOnly />
            </Col>
            <Col md={{ span: 2 }} className="recipient-default-value">
              <Form.Control
                defaultValue={"$" + totalInvoiceAmount}
                plaintext
                readOnly
              />
            </Col>
          </Row>
        </div>
        <Button variant="outline-success" onClick={handleAddRow}>
          + Add another item/service
        </Button>
      </Form.Group>
    </div>
  );
}
