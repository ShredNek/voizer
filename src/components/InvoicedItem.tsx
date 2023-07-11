import {
  Form,
  Row,
  Col,
  FloatingLabel,
  Button,
  InputGroup,
} from "react-bootstrap";
import { FaXmark } from "react-icons/fa6";
import React, { useState, useEffect } from "react";
import { handleIfQuantityOrRateIsNull } from "../logic/utils";

interface InvoicedItemsInterface {
  bubbleUpTotalAmount: (amount: number) => void;
  id: string;
  deleteThisChild?: () => void;
  firstChild?: boolean;
}

export default function InvoicedItem({
  bubbleUpTotalAmount,
  deleteThisChild,
  firstChild,
  id,
}: InvoicedItemsInterface) {
  const [quantity, setQuantity] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [total, setTotal] = useState(0);

  function handleOnRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRate(e.target.value);
  }

  function handleOnQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuantity(e.target.value);
  }

  useEffect(() => {
    let newTotal = handleIfQuantityOrRateIsNull(Number(quantity), Number(rate));
    setTotal(newTotal);
    bubbleUpTotalAmount(newTotal);
  }, [quantity, rate]);

  return (
    <div className="invoiced-items-rows" id={id}>
      <Row className="g-2 my-1">
        <Col md={{ span: 6 }}>
          <InputGroup>
            {firstChild ? null : (
              <Button
                variant="danger"
                id="button-addon1"
                onClick={deleteThisChild}
              >
                <FaXmark />
              </Button>
            )}
            <FloatingLabel label="Item">
              <Form.Control
                required
                type="name"
                placeholder="First item"
                id="item-name"
              />
            </FloatingLabel>
          </InputGroup>
        </Col>
        <Col md={{ span: 2 }} xs={{ span: 6 }}>
          <FloatingLabel label="Qnt.">
            <Form.Control
              required
              type="number"
              min={1}
              placeholder="0"
              value={quantity}
              onChange={handleOnQuantityChange}
              id="quantity"
            />
          </FloatingLabel>
        </Col>
        <Col md={{ span: 2 }} xs={{ span: 6 }}>
          <FloatingLabel label="Rate">
            <Form.Control
              required
              type="float"
              min={1}
              placeholder="1"
              value={rate}
              onChange={handleOnRateChange}
              id="rate"
            />
          </FloatingLabel>
        </Col>
        <Col md={{ span: 2 }} className="recipient-default-value">
          <Form.Control value={`$${total.toFixed(2)}`} plaintext readOnly />
        </Col>
      </Row>
    </div>
  );
}
