import { useEffect, useState } from "react";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import InvoicedItemsServices from "./InvoicedItemsServices";
import {
  childAmountAndKey,
  keyIsInTotalAmounts,
  getByKeyAndCallbackSetState,
  removeByKeyAndCallbackSetState,
  incrementId,
} from "./utils";

export default function RecipientChildren() {
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [totalItemsServiceRowKeys, setTotalItemsServiceRowKeys] = useState<
    number[]
  >([]);
  const [itemServiceAmountsAndKeys, setItemServiceAmountsAndKeys] = useState<
    childAmountAndKey[]
  >([]);

  function handleAddRow() {
    if (totalItemsServiceRowKeys.length !== 0) {
      const numbToAdd = incrementId(totalItemsServiceRowKeys);
      setTotalItemsServiceRowKeys([...totalItemsServiceRowKeys, numbToAdd]);
      return;
    }
    setTotalItemsServiceRowKeys([2]);
  }

  function refreshServiceAmountUsingChildKey(amount: number, key: number) {
    if (!keyIsInTotalAmounts(key, itemServiceAmountsAndKeys)) {
      const newAmountAndKey: childAmountAndKey = { amount, key };
      setItemServiceAmountsAndKeys([
        ...itemServiceAmountsAndKeys,
        newAmountAndKey,
      ]);
      return;
    }

    getByKeyAndCallbackSetState(
      key,
      amount,
      itemServiceAmountsAndKeys,
      setItemServiceAmountsAndKeys
    );
  }

  // ? This is what sets the total for the invoice
  // ? it watches for changes in the InvoicedItemsServices children
  useEffect(() => {
    let newInvoiceTotal = 0;

    itemServiceAmountsAndKeys.forEach((e) => {
      newInvoiceTotal = newInvoiceTotal + e.amount;
    });

    setTotalInvoiceAmount(newInvoiceTotal);
  }, [itemServiceAmountsAndKeys, totalItemsServiceRowKeys]);

  function removeItemServiceChildRow(key: number) {
    const allChildren = [...totalItemsServiceRowKeys];
    let newChildren: number[] = [];
    allChildren.forEach((n) => (n !== key ? newChildren.push(n) : null));
    setTotalItemsServiceRowKeys(newChildren);
    removeByKeyAndCallbackSetState(
      key,
      itemServiceAmountsAndKeys,
      setItemServiceAmountsAndKeys
    );
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
          <InvoicedItemsServices
            key={1}
            bubbleUpTotalAmount={(amount: number) =>
              refreshServiceAmountUsingChildKey(amount, 1)
            }
            firstChild={true}
          />
          {totalItemsServiceRowKeys
            ? totalItemsServiceRowKeys.map((key) => {
                return (
                  <InvoicedItemsServices
                    key={key}
                    bubbleUpTotalAmount={(amount: number) =>
                      refreshServiceAmountUsingChildKey(amount, key)
                    }
                    deleteThisChild={() => removeItemServiceChildRow(key)}
                  />
                );
              })
            : null}
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
                value={`$${totalInvoiceAmount.toFixed(2)}`}
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
