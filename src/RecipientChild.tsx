import { useEffect, useState } from "react";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import InvoicedItem from "./InvoicedItem";
import {
  AmountAndKey,
  keyIsInTotalAmounts,
  getAmountByKeyAndCallbackSetState,
  removeByKeyAndCallbackSetState,
  incrementId,
  deleteKeyAndCallbackSetState,
  getTodaysDate,
} from "./utils";

interface RecipientChild {
  invoiceNumberAsString: string;
  firstChild?: boolean;
  deleteThisChild?: () => void;
}

export default function RecipientChild({
  invoiceNumberAsString,
  firstChild,
  deleteThisChild,
}: RecipientChild) {
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [allItemsRowKeys, setAllItemsRowKeys] = useState<number[]>([]);
  const [itemAmountsAndKeys, setItemAmountsAndKeys] = useState<AmountAndKey[]>(
    []
  );

  function handleAddRow() {
    if (allItemsRowKeys.length !== 0) {
      const numbToAdd = incrementId(allItemsRowKeys);
      setAllItemsRowKeys([...allItemsRowKeys, numbToAdd]);
      return;
    }
    // ? set to the umber 2 cause... idfk
    // ? it is only a means of makring a place in an array so it's fine for now.
    // ? the methods on this component only increment, not fill in the gaps
    setAllItemsRowKeys([2]);
  }

  function refreshServiceAmountUsingChildKey(amount: number, key: number) {
    // ? this function must be used as the onChange callback,
    // ? to set the amount of key's respective amount in the
    // ? state item in the itemAmountsAndKeys array
    if (!keyIsInTotalAmounts(key, itemAmountsAndKeys)) {
      const newAmountAndKey: AmountAndKey = { amount, key };
      setItemAmountsAndKeys([...itemAmountsAndKeys, newAmountAndKey]);
      return;
    }

    getAmountByKeyAndCallbackSetState(
      key,
      amount,
      itemAmountsAndKeys,
      setItemAmountsAndKeys
    );
  }

  function removeItemChildRow(key: number) {
    // ? handles the deletion of a InvoicedItems row
    deleteKeyAndCallbackSetState(key, allItemsRowKeys, setAllItemsRowKeys);
    removeByKeyAndCallbackSetState(
      key,
      itemAmountsAndKeys,
      setItemAmountsAndKeys
    );
  }

  useEffect(() => {
    // ? This is what sets the total for the invoice
    // ? it watches for changes in the InvoicedItem children
    let newInvoiceTotal = 0;

    itemAmountsAndKeys.forEach((e) => {
      newInvoiceTotal = newInvoiceTotal + e.amount;
    });

    setTotalInvoiceAmount(newInvoiceTotal);
  }, [itemAmountsAndKeys, allItemsRowKeys]);

  return (
    <div className="reactive-recipient-children" id={invoiceNumberAsString}>
      <Row>
        <Col>
          <h4 className="mx-1">Recipient details</h4>
        </Col>
        <Col>
          <p>INV#{invoiceNumberAsString}</p>
        </Col>
      </Row>
      <Form.Group>
        <Row className="g-2">
          <Col>
            <FloatingLabel label="Full name">
              <Form.Control type="name" placeholder="John Smith" id="name" />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label="Email">
              <Form.Control
                type="email"
                placeholder="example@test.com"
                id="email"
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="g-2 my-1 mb-3">
          <Col md={{ span: 8 }}>
            <FloatingLabel label="Address (optional)">
              <Form.Control
                type="address"
                placeholder="1 Test Avenue"
                id="address"
              />
            </FloatingLabel>
          </Col>
          <Col md={{ span: 4 }}>
            <FloatingLabel label="Date (Optional)">
              <Form.Control
                type="string"
                placeholder={getTodaysDate()}
                id="date"
              />
            </FloatingLabel>
          </Col>
        </Row>
        <div className="divider white" />
        <h4 className="m-1">Invoiced items</h4>
        <div id="all-invoiced-amount-rows">
          <InvoicedItem
            key={1}
            id={"1"}
            bubbleUpTotalAmount={(amount: number) =>
              refreshServiceAmountUsingChildKey(amount, 1)
            }
            firstChild={true}
          />
          {allItemsRowKeys
            ? allItemsRowKeys.map((key) => {
                return (
                  <InvoicedItem
                    key={key}
                    id={key.toString()}
                    bubbleUpTotalAmount={(amount: number) =>
                      refreshServiceAmountUsingChildKey(amount, key)
                    }
                    deleteThisChild={() => removeItemChildRow(key)}
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
                id="invoice-total"
              />
            </Col>
          </Row>
        </div>
        <Row>
          <Col>
            <Button variant="outline-success" onClick={handleAddRow}>
              + Add another item
            </Button>
          </Col>
          <Col>
            {firstChild ? null : (
              <Button variant="danger" onClick={deleteThisChild}>
                remove this recipient
              </Button>
            )}
          </Col>
        </Row>
      </Form.Group>
    </div>
  );
}
