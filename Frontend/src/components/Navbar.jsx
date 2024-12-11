import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

const NavbarHead = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
          <Nav.Link as={Link} to="/">Tasks</Nav.Link>
          <Nav.Link as={Link} to="/trashed">Trashed</Nav.Link>
          <Nav.Link as={Link} to="/categories">Categories</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      )
}

export default NavbarHead