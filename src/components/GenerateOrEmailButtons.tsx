import { Button, Row, Col, ButtonToolbar } from "react-bootstrap";
import { useState } from "react";

interface GenerateOrEmailButtons {
  active: boolean;
  DownloadInvoices: () => void;
  EmailInvoices: () => void;
  formRef?: React.RefObject<HTMLFormElement>;
}

export default function GenerateOrEmailButtons({
  DownloadInvoices,
  EmailInvoices,
  formRef,
  active,
}: GenerateOrEmailButtons) {
  const [disabled, setDisabled] = useState(false);

  const handleEmailButtonClick = () => {
    EmailInvoices();
    const event = new Event("submit", { cancelable: true, bubbles: true });
    formRef?.current?.dispatchEvent(event);
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 4000);
  };

  return (
    <>
      <div className="my-4">
        <Row>
          <Col md={{ span: 6 }} className="my-2">
            <div className="d-grid">
              <Button
                disabled={!active}
                type="submit"
                variant="outline-primary"
                size="lg"
                onClick={DownloadInvoices}
              >
                Generate invoices
              </Button>
            </div>
          </Col>
          <Col md={{ span: 6 }} className="my-2">
            <div className="d-grid">
              <Button
                type="submit"
                variant="outline-success"
                size="lg"
                onClick={handleEmailButtonClick}
                disabled={disabled || !active}
              >
                {disabled ? "Sending" : "Send All Invoices"}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
