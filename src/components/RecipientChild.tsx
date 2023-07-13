import { useEffect, useState, useRef, useImperativeHandle } from "react";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import InvoicedItem, { InvoicedItemsInterfaceMethods } from "./InvoicedItem";
import {
  AmountAndKey,
  keyIsInTotalAmounts,
  getAmountByKeyAndCallbackSetState,
  removeByKeyAndCallbackSetState,
  incrementId,
  deleteKeyAndCallbackSetState,
  getTodaysDate,
} from "../logic/utils";

export interface RecipientChildMethods {
  clearChildItems: () => void;
}
interface RecipientChild {
  invoiceNumberAsString: string;
  firstChild?: boolean;
  firstChildRef?: React.MutableRefObject<any>;
  deleteThisChild?: () => void;
}

export default function RecipientChild({
  invoiceNumberAsString,
  firstChild,
  deleteThisChild,
  firstChildRef,
}: RecipientChild) {
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [allItemsRowKeys, setAllItemsRowKeys] = useState<number[]>([]);
  const [itemAmountsAndKeys, setItemAmountsAndKeys] = useState<AmountAndKey[]>(
    []
  );
  const firstItemRef = useRef<InvoicedItemsInterfaceMethods | null>(null);

  useImperativeHandle(firstChildRef, () => ({
    clearChildItems() {
      () => setAllItemsRowKeys([]);
      firstItemRef.current?.clearItemAmounts();
    },
  }));

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

  function refreshTotalAmountUsingChildKey(amount: number, key: number) {
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
    <div
      className="reactive-recipient-children"
      id={invoiceNumberAsString}
      ref={firstChildRef}
    >
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
          <Col md={{ span: 6 }} xsm={{ span: 12 }}>
            <FloatingLabel label="Full name">
              <Form.Control
                required
                type="name"
                placeholder="John Smith"
                id="name"
              />
              <Form.Control.Feedback type="invalid">
                Please enter the recipient's full name
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md={{ span: 6 }} xsm={{ span: 12 }}>
            <FloatingLabel label="Email">
              <Form.Control
                required
                type="email"
                placeholder="example@test.com"
                id="email"
              />
              <Form.Control.Feedback type="invalid">
                Please enter the recipient's email
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="g-2 my-1 mb-3">
          <Col>
            <FloatingLabel label="Address">
              <Form.Control
                type="address"
                placeholder="1 Test Avenue"
                id="address"
              />
            </FloatingLabel>
          </Col>
          {/* // TODO - ADD THIS FEATURE LATER */}
          {/* <Col md={{ span: 4 }}>
            <FloatingLabel label="Receipt Date">
              <Form.Control
                type="string"
                placeholder={getTodaysDate()}
                id="date"
              />
            </FloatingLabel>
          </Col> */}
        </Row>
        <div className="divider white" />
        <h4 className="m-1">Invoiced items</h4>
        <div id="all-invoiced-amount-rows">
          <InvoicedItem
            key={1}
            id={"1"}
            bubbleUpTotalAmount={(amount: number) =>
              refreshTotalAmountUsingChildKey(amount, 1)
            }
            firstChild={true}
            firstItemRef={firstItemRef}
          />
          {allItemsRowKeys
            ? allItemsRowKeys.map((key) => {
                return (
                  <InvoicedItem
                    key={key}
                    id={key.toString()}
                    bubbleUpTotalAmount={(amount: number) =>
                      refreshTotalAmountUsingChildKey(amount, key)
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
              xs={{ span: 3 }}
              className="recipient-default-value"
            >
              <Form.Control value="TOTAL:" plaintext readOnly />
            </Col>
            <Col
              md={{ span: 2 }}
              xs={{ span: 3 }}
              className="recipient-default-value"
            >
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
