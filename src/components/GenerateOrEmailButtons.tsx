import { Container, Button } from "react-bootstrap";

interface GenerateOrEmailButtons {
  DownloadInvoices: () => void;
  EmailInvoices: () => void;
}

export default function GenerateOrEmailButtons({
  DownloadInvoices,
  EmailInvoices,
}: GenerateOrEmailButtons) {
  return (
    <>
      <Container className="center-children my-5">
        <Button
          variant="outline-primary"
          size={"lg"}
          className="mx-2"
          onClick={DownloadInvoices}
        >
          Generate invoices
        </Button>
        <Button
          variant="outline-success"
          size={"lg"}
          className="mx-2"
          onClick={EmailInvoices}
        >
          Send all invoices
        </Button>
      </Container>
    </>
  );
}
