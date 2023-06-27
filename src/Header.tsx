import { Navbar, Container } from "react-bootstrap";

export default function Header() {
  return (
    <div>
      <Navbar bg="black">
        <Container style={{ justifyItems: "center" }}>
          <h2 style={{ color: "white", margin: "0" }}>Voizer</h2>
          <p style={{ color: "white", margin: "0" }} className="">
            Your quick, convenient invoicing buddy!
          </p>
        </Container>
      </Navbar>
    </div>
  );
}
