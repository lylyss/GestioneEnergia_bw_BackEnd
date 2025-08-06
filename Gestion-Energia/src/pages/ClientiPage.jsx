import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ClientiPage() {
  // Carica i clienti dal localStorage all'avvio
  const [clienti, setClienti] = useState(() => {
    const clientiSalvati = localStorage.getItem("clienti");
    return clientiSalvati ? JSON.parse(clientiSalvati) : [];
  });
  const [form, setForm] = useState({
    ragioneSociale: "",
    partitaIva: "",
    email: "",
    dataInserimento: "",
    dataUltimoContatto: "",
    fatturatoAnnuale: "",
    pec: "",
    telefono: "",
    emailContatto: "",
    nomeContatto: "",
    cognomeContatto: "",
    telefonoContatto: "",
    logoAziendale: "",
  });
  const [indiceModifica, setIndiceModifica] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [colonnaOrdinamento, setColonnaOrdinamento] = useState(null);
  const [direzioneOrdinamento, setDirezioneOrdinamento] = useState("asc");

  const gestisciCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const gestisciInvio = (e) => {
    e.preventDefault();
    if (indiceModifica !== null) {
      // Modifica cliente esistente
      const nuoviClienti = clienti.map((client, i) => (i === indiceModifica ? form : client));
      setClienti(nuoviClienti);
      setIndiceModifica(null);
    } else {
      // Aggiungi nuovo cliente
      setClienti([...clienti, form]);
    }
    setForm({
      ragioneSociale: "",
      partitaIva: "",
      email: "",
      dataInserimento: "",
      dataUltimoContatto: "",
      fatturatoAnnuale: "",
      pec: "",
      telefono: "",
      emailContatto: "",
      nomeContatto: "",
      cognomeContatto: "",
      telefonoContatto: "",
      logoAziendale: "",
    });
  };

  // eliminaCliente riceve l'indice (indiceCliente) del cliente da eliminare e rimuove quel cliente dall'array clienti
  const eliminaCliente = (indiceCliente) => {
    setClienti(clienti.filter((_, indiceCorrente) => indiceCorrente !== indiceCliente));
    if (indiceModifica === indiceCliente) {
      setIndiceModifica(null);
      setForm({
        ragioneSociale: "",
        partitaIva: "",
        email: "",
        dataInserimento: "",
        dataUltimoContatto: "",
        fatturatoAnnuale: "",
        pec: "",
        telefono: "",
        emailContatto: "",
        nomeContatto: "",
        cognomeContatto: "",
        telefonoContatto: "",
        logoAziendale: "",
      });
    }
  };

  const modificaCliente = (indiceCliente) => {
    setForm(clienti[indiceCliente]);
    setIndiceModifica(indiceCliente);
  };

  // Salva i clienti nel localStorage ogni volta che cambiano
  useEffect(() => {
    localStorage.setItem("clienti", JSON.stringify(clienti));
  }, [clienti]);

  // Filtra i clienti in base al testo inserito (ragione sociale o partita IVA)
  const clientiFiltrati = clienti.filter(
    (cliente) => cliente.ragioneSociale.toLowerCase().includes(filtro.toLowerCase()) || cliente.partitaIva.toLowerCase().includes(filtro.toLowerCase())
  );

  // Funzione per ordinare i clienti
  const ordinaClienti = (colonna) => {
    if (colonnaOrdinamento === colonna) {
      setDirezioneOrdinamento(direzioneOrdinamento === "asc" ? "desc" : "asc");
    } else {
      setColonnaOrdinamento(colonna);
      setDirezioneOrdinamento("asc");
    }
  };

  // Applica ordinamento ai clienti filtrati
  const clientiOrdinati = [...clientiFiltrati].sort((a, b) => {
    if (!colonnaOrdinamento) return 0;
    let valoreA = a[colonnaOrdinamento];
    let valoreB = b[colonnaOrdinamento];
    if (colonnaOrdinamento === "fatturatoAnnuale") {
      valoreA = parseFloat(valoreA) || 0;
      valoreB = parseFloat(valoreB) || 0;
    } else if (colonnaOrdinamento === "dataInserimento" || colonnaOrdinamento === "dataUltimoContatto") {
      valoreA = valoreA || "";
      valoreB = valoreB || "";
    } else {
      valoreA = valoreA ? valoreA.toLowerCase() : "";
      valoreB = valoreB ? valoreB.toLowerCase() : "";
    }
    if (valoreA < valoreB) return direzioneOrdinamento === "asc" ? -1 : 1;
    if (valoreA > valoreB) return direzioneOrdinamento === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Container className="py-4">
      <h1>Gestione Clienti</h1>
      <Form className="mb-4" onSubmit={gestisciInvio}>
        <h4>{indiceModifica !== null ? "Modifica cliente" : "Aggiungi nuovo cliente"}</h4>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Ragione Sociale" name="ragioneSociale" value={form.ragioneSociale} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Partita IVA" name="partitaIva" value={form.partitaIva} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="email" placeholder="Email" name="email" value={form.email} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Data Inserimento</Form.Label>
          <Form.Control type="date" name="dataInserimento" value={form.dataInserimento} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Data Ultimo Contatto</Form.Label>
          <Form.Control type="date" name="dataUltimoContatto" value={form.dataUltimoContatto} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="number"
            placeholder="Fatturato Annuale"
            name="fatturatoAnnuale"
            value={form.fatturatoAnnuale}
            onChange={gestisciCambio}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="email" placeholder="PEC" name="pec" value={form.pec} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="tel" placeholder="Telefono" name="telefono" value={form.telefono} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="email" placeholder="Email Contatto" name="emailContatto" value={form.emailContatto} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Nome Contatto" name="nomeContatto" value={form.nomeContatto} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Cognome Contatto" name="cognomeContatto" value={form.cognomeContatto} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="tel" placeholder="Telefono Contatto" name="telefonoContatto" value={form.telefonoContatto} onChange={gestisciCambio} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Logo Aziendale (URL)" name="logoAziendale" value={form.logoAziendale} onChange={gestisciCambio} />
        </Form.Group>
        <Button variant="primary" type="submit">
          {indiceModifica !== null ? "Salva Modifiche" : "Aggiungi"}
        </Button>
        {indiceModifica !== null && (
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => {
              setIndiceModifica(null);
              setForm({
                ragioneSociale: "",
                partitaIva: "",
                email: "",
                dataInserimento: "",
                dataUltimoContatto: "",
                fatturatoAnnuale: "",
                pec: "",
                telefono: "",
                emailContatto: "",
                nomeContatto: "",
                cognomeContatto: "",
                telefonoContatto: "",
                logoAziendale: "",
              });
            }}
          >
            Annulla
          </Button>
        )}
      </Form>
      <h4>Elenco Clienti</h4>
      <Form.Group className="mb-3">
        <Form.Control type="text" placeholder="Cerca per Ragione Sociale o Partita IVA" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ cursor: "pointer" }} onClick={() => ordinaClienti("ragioneSociale")}>
              Ragione Sociale
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => ordinaClienti("partitaIva")}>
              Partita IVA
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => ordinaClienti("email")}>
              Email
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => ordinaClienti("fatturatoAnnuale")}>
              Fatturato
            </th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {clientiOrdinati.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Nessun cliente trovato
              </td>
            </tr>
          ) : (
            clientiOrdinati.map((cliente, indiceCliente) => (
              <tr key={indiceCliente}>
                <td>{cliente.ragioneSociale}</td>
                <td>{cliente.partitaIva}</td>
                <td>{cliente.email}</td>
                <td>{cliente.fatturatoAnnuale}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => modificaCliente(indiceCliente)}>
                    Modifica
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => eliminaCliente(indiceCliente)}>
                    Elimina
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default ClientiPage;
