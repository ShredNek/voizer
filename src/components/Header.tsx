import { Navbar, Container, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Navbar bg="black">
      <Container className="flex-column flex-md-row">
        <Col md={2} className="mx-4">
          <h2 style={{ color: "white", margin: 0 }}>Voizer</h2>
        </Col>
        <Col md={8} className="justify-content-end">
          <Row>
            <Col md={4} className="my-2">
              <Link to={"manual"}>
                <Button variant="light" className="w-100">
                  Manual Entry
                </Button>
              </Link>
            </Col>
            <Col md={4} className="my-2">
              <Link to={"json"}>
                <Button variant="light" className="w-100">
                  Json
                </Button>
              </Link>
            </Col>
            <Col md={4} className="my-2">
              <Link to={"terms"}>
                <Button variant="success" className="w-100">
                  Terms of Use
                </Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </Container>
    </Navbar>
  );
}
