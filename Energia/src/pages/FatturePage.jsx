import { useState } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function FatturePage() {
  // Clienti di esempio
  const clientiEsempio = [
    { id: 1, ragioneSociale: "Conad Srl" },
    { id: 2, ragioneSociale: "Esselunga Spa" },
    { id: 3, ragioneSociale: "Gamma Sas" },
  ];

  const [fatture, setFatture] = useState([]);
  const [formFattura, setFormFattura] = useState({
    numero: "",
    data: "",
    importo: "",
    clienteId: clientiEsempio[0].id,
  });

  const gestisciCambioFattura = (e) => {
    setFormFattura({ ...formFattura, [e.target.name]: e.target.value });
  };

  const gestisciInvioFattura = (e) => {
    e.preventDefault();
    setFatture([...fatture, formFattura]);
    setFormFattura({
      numero: "",
      data: "",
      importo: "",
      clienteId: clientiEsempio[0].id,
    });
  };

  return (
    <Container className="py-4">
      <h1>Gestione Fatture</h1>
      <Form className="mb-4" onSubmit={gestisciInvioFattura}>
        <h4>Aggiungi nuova fattura</h4>
        <Form.Group className="mb-2">
          <Form.Label>Cliente</Form.Label>
          <Form.Select name="clienteId" value={formFattura.clienteId} onChange={gestisciCambioFattura} required>
            {clientiEsempio.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.ragioneSociale}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Numero" name="numero" value={formFattura.numero} onChange={gestisciCambioFattura} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="date" placeholder="Data" name="data" value={formFattura.data} onChange={gestisciCambioFattura} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="number" placeholder="Importo" name="importo" value={formFattura.importo} onChange={gestisciCambioFattura} required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Aggiungi
        </Button>
      </Form>
      <h4>Elenco Fatture</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Numero</th>
            <th>Data</th>
            <th>Importo</th>
          </tr>
        </thead>
        <tbody>
          {fatture.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                Nessuna fattura inserita
              </td>
            </tr>
          ) : (
            fatture.map((fattura, indice) => {
              const cliente = clientiEsempio.find((c) => c.id.toString() === fattura.clienteId.toString());
              return (
                <tr key={indice}>
                  <td>{cliente ? cliente.ragioneSociale : "-"}</td>
                  <td>{fattura.numero}</td>
                  <td>{fattura.data}</td>
                  <td>{fattura.importo}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default FatturePage;
