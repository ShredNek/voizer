import { Navbar, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <Navbar bg="black">
        <Container style={{ justifyItems: "space-between" }}>
          <h2 style={{ color: "white", margin: "0" }}>Voizer</h2>
          <div>
            <Link to={"manual"}>
              <Button variant="light" className="mx-2">
                Manual Entry
              </Button>
            </Link>
            <Link to={"json"}>
              <Button variant="light" className="mx-2">
                Json
              </Button>
            </Link>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}
