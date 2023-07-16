import {
  Form,
  Row,
  Col,
  FloatingLabel,
  Button,
  InputGroup,
} from "react-bootstrap";
import { FaXmark } from "react-icons/fa6";
import React, { useState, useEffect, useImperativeHandle } from "react";
import { handleIfQuantityOrRateIsNull } from "../logic/utils";
import { InvoiceRecipientItemState } from "../../interfaces/invoices";

export interface InvoicedItemsInterfaceMethods {
  clearItemAmounts: () => void;
}
interface InvoicedItemsInterface {
  bubbleUpItem: (item: InvoiceRecipientItemState) => void;
  id: string;
  deleteThisChild?: () => void;
  firstChild?: boolean;
  firstItemRef?: React.MutableRefObject<any>;
  itemProps: InvoiceRecipientItemState;
}

export default function InvoicedItem({
  bubbleUpItem,
  deleteThisChild,
  firstChild,
  id,
  firstItemRef,
  itemProps,
}: InvoicedItemsInterface) {
  const [itemDetails, setItemDetails] = useState<InvoiceRecipientItemState>({
    ...itemProps,
  });
  const [total, setTotal] = useState(0);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const newState: InvoiceRecipientItemState = {
      ...itemDetails,
      [e.target.name]: e.target.value,
    };

    bubbleUpItem(newState);
    setItemDetails({
      ...newState,
      key: newState.key,
      itemName: newState.itemName,
    });

    if (
      Number(newState.quantity) < 0 ||
      Number(newState.rate) < 0 ||
      Number.isNaN(Number(newState.quantity)) ||
      Number.isNaN(Number(newState.rate))
    ) {
      return;
    }

    let newTotal = handleIfQuantityOrRateIsNull(
      Number(newState.quantity),
      Number(newState.rate)
    );
    setTotal(newTotal);
    bubbleUpItem(newState);
  }

  useEffect(() => {
    const quantity = itemProps ? Number(itemProps.quantity) : 0;
    const rate = itemProps ? Number(itemProps.rate) : 0;

    let newTotal = handleIfQuantityOrRateIsNull(quantity, rate);
    setTotal(newTotal);
    bubbleUpItem({ ...itemProps });
  }, []);

  useImperativeHandle(firstItemRef, () => ({
    clearItemAmounts() {
      setItemDetails({
        itemName: "",
        quantity: "",
        rate: "",
        key: id,
      });
      setTotal(0);
    },
  }));

  return (
    <div className="invoiced-items-rows" ref={firstItemRef}>
      <Row className="g-2 my-1">
        <Col md={{ span: 6 }}>
          <InputGroup>
            {firstChild ? null : (
              <Button variant="danger" onClick={deleteThisChild}>
                <FaXmark />
              </Button>
            )}
            <FloatingLabel label="Item">
              <Form.Control
                required
                type="name"
                name="itemName"
                placeholder="First item"
                value={itemDetails.itemName}
                onChange={handleChange}
              />
            </FloatingLabel>
          </InputGroup>
        </Col>
        <Col md={{ span: 2 }} xs={{ span: 6 }}>
          <FloatingLabel label="Qnt.">
            <Form.Control
              required
              type="number"
              name="quantity"
              min={1}
              placeholder="0"
              value={itemDetails.quantity}
              onChange={handleChange}
            />
          </FloatingLabel>
        </Col>
        <Col md={{ span: 2 }} xs={{ span: 6 }}>
          <FloatingLabel label="Rate">
            <Form.Control
              required
              type="float"
              name="rate"
              min={1}
              placeholder="1"
              value={itemDetails.rate}
              onChange={handleChange}
            />
          </FloatingLabel>
        </Col>
        <Col md={{ span: 2 }} className="recipient-default-value">
          <Form.Control
            name="total"
            value={`$${total.toFixed(2)}`}
            plaintext
            readOnly
          />
        </Col>
      </Row>
    </div>
  );
}
