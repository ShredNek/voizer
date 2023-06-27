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
import { handleIfQuantityOrRateIsNull } from "./utils";

interface InvoicedItemsServicesInterface {
  bubbleUpTotalAmount: (amount: number) => void;
}

export default function InvoicedItemsServices({
  bubbleUpTotalAmount,
}: InvoicedItemsServicesInterface) {
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
  }, [quantity, rate]);

  return (
    <div className="invoiced-items-services-rows">
      <Row className="g-2 my-1">
        <Col md={{ span: 6 }}>
          <InputGroup>
            <Button variant="danger" id="button-addon1">
              <FaXmark />
            </Button>
            <FloatingLabel label="Item/service">
              <Form.Control type="name" placeholder="John Smith" />
            </FloatingLabel>
          </InputGroup>
        </Col>
        <Col md={{ span: 2 }}>
          <FloatingLabel label="Quantity">
            <Form.Control
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleOnQuantityChange(e)
              }
            />
          </FloatingLabel>
        </Col>
        <Col md={{ span: 2 }}>
          <FloatingLabel label="Rate">
            <Form.Control
              type="number"
              placeholder="0"
              value={rate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleOnRateChange(e)
              }
            />
          </FloatingLabel>
        </Col>
        <Col md={{ span: 2 }} className="recipient-default-value">
          <Form.Control value={`$${total}`} plaintext readOnly />
        </Col>
      </Row>
    </div>
  );
}
