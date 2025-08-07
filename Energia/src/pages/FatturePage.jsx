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
  const [indiceModificaFattura, setIndiceModificaFattura] = useState(null);
  const [filtro, setFiltro] = useState("");

  const gestisciCambioFattura = (e) => {
    setFormFattura({ ...formFattura, [e.target.name]: e.target.value });
  };

  const gestisciInvioFattura = (e) => {
    e.preventDefault();
    if (indiceModificaFattura !== null) {
      // Modifica fattura esistente
      const nuoveFatture = fatture.map((fattura, indice) => (indice === indiceModificaFattura ? formFattura : fattura));
      setFatture(nuoveFatture);
      setIndiceModificaFattura(null);
    } else {
      // Aggiungi nuova fattura
      setFatture([...fatture, formFattura]);
    }
    setFormFattura({ numero: "", data: "", importo: "", clienteId: clientiEsempio[0].id });
  };

  const modificaFattura = (indiceFattura) => {
    setFormFattura(fatture[indiceFattura]);
    setIndiceModificaFattura(indiceFattura);
  };

  const eliminaFattura = (indiceFattura) => {
    setFatture(fatture.filter((_, indiceCorrente) => indiceCorrente !== indiceFattura));
  };

  // Filtra le fatture in base al testo inserito (cliente, numero, data, importo)
  const fattureFiltrate = fatture.filter((fattura) => {
    const cliente = clientiEsempio.find((c) => c.id.toString() === fattura.clienteId.toString());
    return (
      (cliente && cliente.ragioneSociale.toLowerCase().includes(filtro.toLowerCase())) ||
      fattura.numero.toLowerCase().includes(filtro.toLowerCase()) ||
      fattura.data.includes(filtro) ||
      fattura.importo.toString().includes(filtro)
    );
  });

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
          {indiceModificaFattura !== null ? "Salva Modifiche" : "Aggiungi"}
        </Button>
        {indiceModificaFattura !== null && (
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => {
              setIndiceModificaFattura(null);
              setFormFattura({ numero: "", data: "", importo: "", clienteId: clientiEsempio[0].id });
            }}
          >
            Annulla
          </Button>
        )}
      </Form>
      <h4>Elenco Fatture</h4>
      <Form.Group className="mb-3">
        <Form.Control type="text" placeholder="Cerca per Cliente, Numero, Data o Importo" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Numero</th>
            <th>Data</th>
            <th>Importo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {fattureFiltrate.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Nessuna fattura trovata
              </td>
            </tr>
          ) : (
            fattureFiltrate.map((fattura, indiceFattura) => {
              const cliente = clientiEsempio.find((c) => c.id.toString() === fattura.clienteId.toString());
              return (
                <tr key={indiceFattura}>
                  <td>{cliente ? cliente.ragioneSociale : "-"}</td>
                  <td>{fattura.numero}</td>
                  <td>{fattura.data}</td>
                  <td>{fattura.importo}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => modificaFattura(indiceFattura)}>
                      Modifica
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => eliminaFattura(indiceFattura)}>
                      Elimina
                    </Button>
                  </td>
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
