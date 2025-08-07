import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function FatturePage() {
  // Clienti di esempio
  const clientiEsempio = [
    { id: 1, ragioneSociale: "Conad Srl" },
    { id: 2, ragioneSociale: "Esselunga Spa" },
    { id: 3, ragioneSociale: "Gamma Sas" },
  ];

  // Carica le fatture dal localStorage all'avvio
  const [fatture, setFatture] = useState(() => {
    const fattureSalvate = localStorage.getItem("fatture");
    return fattureSalvate ? JSON.parse(fattureSalvate) : [];
  });
  const [formFattura, setFormFattura] = useState({
    numero: "",
    data: "",
    importo: "",
    clienteId: clientiEsempio[0].id,
  });
  const [indiceModificaFattura, setIndiceModificaFattura] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [colonnaOrdinamento, setColonnaOrdinamento] = useState(null);
  const [direzioneOrdinamento, setDirezioneOrdinamento] = useState("asc");
  const [mostraDettagli, setMostraDettagli] = useState(false);
  const [fatturaSelezionata, setFatturaSelezionata] = useState(null);

  const gestisciCambioFattura = (e) => {
    setFormFattura({ ...formFattura, [e.target.name]: e.target.value });
  };

  const gestisciInvioFattura = async (e) => {
    e.preventDefault();
    if (indiceModificaFattura !== null) {
      // Modifica fattura esistente
      // await modificaFatturaApi(fatture[indiceModificaFattura].id, formFattura); // decommenta quando hai l'id dal backend
      const nuoveFatture = fatture.map((fattura, indice) => (indice === indiceModificaFattura ? formFattura : fattura));
      setFatture(nuoveFatture);
      setIndiceModificaFattura(null);
    } else {
      // Aggiungi nuova fattura
      // await aggiungiFatturaApi(formFattura); // decommenta per usare API
      setFatture([...fatture, formFattura]);
    }
    setFormFattura({ numero: "", data: "", importo: "", clienteId: clientiEsempio[0].id });
  };

  const modificaFattura = (indiceFattura) => {
    setFormFattura(fatture[indiceFattura]);
    setIndiceModificaFattura(indiceFattura);
  };

  const eliminaFattura = async (indiceFattura) => {
    // await eliminaFatturaApi(fatture[indiceFattura].id); // decommenta per usare API
    setFatture(fatture.filter((_, indiceCorrente) => indiceCorrente !== indiceFattura));
  };

  const apriDettagli = (fattura) => {
    setFatturaSelezionata(fattura);
    setMostraDettagli(true);
  };
  const chiudiDettagli = () => {
    setMostraDettagli(false);
    setFatturaSelezionata(null);
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

  const ordinaFatture = (colonna) => {
    if (colonnaOrdinamento === colonna) {
      setDirezioneOrdinamento(direzioneOrdinamento === "asc" ? "desc" : "asc");
    } else {
      setColonnaOrdinamento(colonna);
      setDirezioneOrdinamento("asc");
    }
  };

  const fattureOrdinate = [...fattureFiltrate].sort((a, b) => {
    if (!colonnaOrdinamento) return 0;
    let valoreA, valoreB;
    if (colonnaOrdinamento === "cliente") {
      valoreA = clientiEsempio.find((c) => c.id.toString() === a.clienteId.toString())?.ragioneSociale || "";
      valoreB = clientiEsempio.find((c) => c.id.toString() === b.clienteId.toString())?.ragioneSociale || "";
    } else if (colonnaOrdinamento === "importo") {
      valoreA = parseFloat(a.importo) || 0;
      valoreB = parseFloat(b.importo) || 0;
    } else {
      valoreA = a[colonnaOrdinamento] || "";
      valoreB = b[colonnaOrdinamento] || "";
    }
    if (valoreA < valoreB) return direzioneOrdinamento === "asc" ? -1 : 1;
    if (valoreA > valoreB) return direzioneOrdinamento === "asc" ? 1 : -1;
    return 0;
  });

  // Salva le fatture nel localStorage ogni volta che cambiano
  useEffect(() => {
    localStorage.setItem("fatture", JSON.stringify(fatture));
  }, [fatture]);

  // Esporta le fatture filtrate e ordinate in CSV
  const esportaCSV = () => {
    const intestazione = ["Cliente", "Numero", "Data", "Importo"];
    const righe = fattureOrdinate.map((fattura) => {
      const cliente = clientiEsempio.find((c) => c.id.toString() === fattura.clienteId.toString());
      return [cliente ? cliente.ragioneSociale : "", fattura.numero, fattura.data, fattura.importo];
    });
    const csvContent = [intestazione, ...righe].map((riga) => riga.map((campo) => `"${campo}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fatture.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Stampa la tabella delle fatture filtrate e ordinate
  const stampaFatture = () => {
    const printContent = document.getElementById("tabella-fatture").outerHTML;
    const win = window.open("", "", "width=900,height=700");
    win.document.write(
      `<!DOCTYPE html><html><head><title>Stampa Fatture</title><style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}th{background:#eee;}</style></head><body>${printContent}</body></html>`
    );
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // Funzioni asincrone per integrazione API REST (da collegare agli endpoint backend)
  async function caricaFattureDaApi() {
    //  const response = await fetch('/api/fatture');
    // const data = await response.json();
    // setFatture(data);
  }

  async function aggiungiFatturaApi(nuovaFattura) {
    //  await fetch('/api/fatture', { method: 'POST', body: JSON.stringify(nuovaFattura), headers: { 'Content-Type': 'application/json' } });
    // Dopo la chiamata, ricarica le fatture
    // await caricaFattureDaApi();
  }

  async function modificaFatturaApi(id, datiFattura) {
    // await fetch(`/api/fatture/${id}`, { method: 'PUT', body: JSON.stringify(datiFattura), headers: { 'Content-Type': 'application/json' } });
    // await caricaFattureDaApi();
  }

  async function eliminaFatturaApi(id) {
    //  await fetch(`/api/fatture/${id}`, { method: 'DELETE' });
    // await caricaFattureDaApi();
  }

  // Funzione asincrona per caricare i clienti da API (da collegare al backend)
  async function caricaClientiDaApi() {
    //  const response = await fetch('/api/clienti');
    // const data = await response.json();
    // setClientiEsempio(data);
  }

  // clienti reali dal backend,:
  // const [clientiEsempio, setClientiEsempio] = useState([]);
  // useEffect(() => { caricaClientiDaApi(); }, []);

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
      <Button variant="success" className="mb-3 me-2" onClick={esportaCSV}>
        Esporta CSV
      </Button>
      <Button variant="primary" className="mb-3" onClick={stampaFatture}>
        Stampa
      </Button>
      <Form.Group className="mb-3">
        <Form.Control type="text" placeholder="Cerca per Cliente, Numero, Data o Importo" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      </Form.Group>
      <Table striped bordered hover id="tabella-fatture">
        <thead>
          <tr>
            <th style={{ cursor: "pointer" }} onClick={() => ordinaFatture("cliente")}>
              Cliente
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => ordinaFatture("numero")}>
              Numero
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => ordinaFatture("data")}>
              Data
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => ordinaFatture("importo")}>
              Importo
            </th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {fattureOrdinate.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Nessuna fattura trovata
              </td>
            </tr>
          ) : (
            fattureOrdinate.map((fattura, indiceFattura) => {
              const cliente = clientiEsempio.find((c) => c.id.toString() === fattura.clienteId.toString());
              return (
                <tr key={indiceFattura}>
                  <td>{cliente ? cliente.ragioneSociale : "-"}</td>
                  <td>{fattura.numero}</td>
                  <td>{fattura.data}</td>
                  <td>{fattura.importo}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => apriDettagli(fattura)}>
                      Dettagli
                    </Button>
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

      {/* Modale Dettagli Fattura */}
      <Modal show={mostraDettagli} onHide={chiudiDettagli}>
        <Modal.Header closeButton>
          <Modal.Title>Dettagli Fattura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fatturaSelezionata && (
            <div>
              <p>
                <strong>Cliente:</strong> {clientiEsempio.find((c) => c.id.toString() === fatturaSelezionata.clienteId.toString())?.ragioneSociale || "-"}
              </p>
              <p>
                <strong>Numero:</strong> {fatturaSelezionata.numero}
              </p>
              <p>
                <strong>Data:</strong> {fatturaSelezionata.data}
              </p>
              <p>
                <strong>Importo:</strong> {fatturaSelezionata.importo}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={chiudiDettagli}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FatturePage;
