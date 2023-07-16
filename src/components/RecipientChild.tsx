import React, { useState, useRef, useImperativeHandle } from "react";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import InvoicedItem, { InvoicedItemsInterfaceMethods } from "./InvoicedItem";
import { incrementKey } from "../logic/utils";
import { recalculateInvoiceTotal } from "../logic/invoiceGenerationLogic";
import {
  InvoiceRecipientDetailsState,
  InvoiceRecipientItemState,
} from "../../interfaces/invoices";

export interface RecipientChildMethods {
  clearChildItems: () => void;
}
interface RecipientChild {
  recipientProps: InvoiceRecipientDetailsState;
  firstChild?: boolean;
  firstChildRef?: React.MutableRefObject<any>;
  deleteThisChild?: (invNumber: string) => void;
  bubbleUpRecipientState: (state: InvoiceRecipientDetailsState) => void;
}

export default function RecipientChild({
  recipientProps,
  firstChild,
  deleteThisChild,
  firstChildRef,
  bubbleUpRecipientState,
}: RecipientChild) {
  const firstItemRef = useRef<InvoicedItemsInterfaceMethods | null>(null);

  const [recipientChildDetails, setRecipientChildDetails] = useState({
    ...recipientProps,
  });

  function handleAddItem() {
    const priorKeys = recipientChildDetails.items.map((i) => {
      return i.key;
    });
    const nextLargestId = incrementKey(priorKeys);
    setRecipientChildDetails({
      ...recipientChildDetails,
      items: [
        ...recipientChildDetails.items,
        { itemName: "", quantity: "", rate: "", key: nextLargestId },
      ],
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const newInvoiceTotal = recalculateInvoiceTotal(
      recipientChildDetails.items
    );

    setRecipientChildDetails(() => ({
      ...recipientChildDetails,
      [e.target.name]: e.target.value,
      invoiceTotal: newInvoiceTotal,
    }));
    bubbleUpRecipientState(recipientChildDetails);
  }

  function handleBubbledItemChange(
    invoiceRecipientItemState: InvoiceRecipientItemState
  ) {
    const arrayWithoutChangedItem = recipientChildDetails.items.filter(
      (i) => i.key !== invoiceRecipientItemState.key
    );

    const sortedItems = [
      ...arrayWithoutChangedItem,
      invoiceRecipientItemState,
    ].sort((a, b) => Number(a.key) - Number(b.key));

    const newInvoiceTotal = recalculateInvoiceTotal(sortedItems);

    const newState = {
      ...recipientChildDetails,
      items: sortedItems,
      invoiceTotal: newInvoiceTotal,
    };

    setRecipientChildDetails(newState);
    bubbleUpRecipientState(newState);
  }

  function removeItem(key: string) {
    const arrayWithoutDeletedItem = recipientChildDetails.items.filter(
      (i) => i.key !== key
    );
    const amounts = arrayWithoutDeletedItem.map((i) => {
      return Number(i.quantity) * Number(i.rate);
    });

    let newInvoiceTotal = amounts.reduce(
      (prev: number, curr: number) => prev + curr,
      0
    );

    setRecipientChildDetails(() => ({
      ...recipientChildDetails,
      invoiceTotal: newInvoiceTotal,
      items: Array.from(arrayWithoutDeletedItem),
    }));
  }

  useImperativeHandle(firstChildRef, () => ({
    clearChildItems() {
      console.log("clearning");
      setRecipientChildDetails(() => ({
        name: "",
        email: "",
        address: "",
        items: [{ itemName: "", quantity: "", rate: "", key: "1" }],
        invoiceTotal: 0,
        invoiceNumber: recipientChildDetails.invoiceNumber,
      }));
      console.log(recipientChildDetails);

      firstItemRef.current?.clearItemAmounts();
    },
  }));

  return (
    <div
      className="reactive-recipient-children"
      id={recipientChildDetails.invoiceNumber}
      ref={firstChildRef}
    >
      <Row>
        <Col>
          <h4 className="mx-1">Recipient details</h4>
        </Col>
        <Col>
          <p>INV#{recipientChildDetails.invoiceNumber}</p>
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
                value={recipientChildDetails.name}
                name="name"
                onChange={handleChange}
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
                value={recipientChildDetails.email}
                name="email"
                onChange={handleChange}
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
                value={recipientChildDetails.address}
                name="address"
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <div className="divider white" />
        <h4 className="m-1">Invoiced items</h4>
        <div id="all-invoiced-amount-rows">
          {recipientChildDetails.items
            ? recipientChildDetails.items.map((item, index) => {
                return (
                  <InvoicedItem
                    key={item.key}
                    firstChild={index === 0 ? true : false}
                    firstItemRef={index === 0 ? firstItemRef : undefined}
                    itemProps={item}
                    id={item.key}
                    bubbleUpItem={(item) => handleBubbledItemChange(item)}
                    deleteThisChild={() => removeItem(item.key)}
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
                value={`$${recipientChildDetails.invoiceTotal.toFixed(2)}`}
                plaintext
                readOnly
                id="invoice-total"
              />
            </Col>
          </Row>
        </div>
        <Row>
          <Col>
            <Button variant="outline-success" onClick={handleAddItem}>
              + Add another item
            </Button>
          </Col>
          {firstChild ? null : (
            <Col>
              <Button
                variant="danger"
                onClick={
                  deleteThisChild
                    ? () => deleteThisChild(recipientChildDetails.invoiceNumber)
                    : undefined
                }
              >
                remove this recipient
              </Button>
            </Col>
          )}
        </Row>
      </Form.Group>
    </div>
  );
}
