import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ClientiPage() {
  return (
    <Container className="py-4">
      <h1>Gestione Clienti</h1>
      <Form className="mb-4">
        <h4>Aggiungi nuovo cliente</h4>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Ragione Sociale" required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Partita IVA" required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="email" placeholder="Email" required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Aggiungi
        </Button>
      </Form>
      <h4>Elenco Clienti</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ragione Sociale</th>
            <th>Partita IVA</th>
            <th>Email</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>{/*  clienti */}</tbody>
      </Table>
    </Container>
  );
}

export default ClientiPage;
