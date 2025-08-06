import { useState } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ClientiPage() {
  const [clienti, setClienti] = useState([]);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setClienti([...clienti, form]);
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

  return (
    <Container className="py-4">
      <h1>Gestione Clienti</h1>
      <Form className="mb-4" onSubmit={handleSubmit}>
        <h4>Aggiungi nuovo cliente</h4>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Ragione Sociale" name="ragioneSociale" value={form.ragioneSociale} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Partita IVA" name="partitaIva" value={form.partitaIva} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Data Inserimento</Form.Label>
          <Form.Control type="date" name="dataInserimento" value={form.dataInserimento} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Data Ultimo Contatto</Form.Label>
          <Form.Control type="date" name="dataUltimoContatto" value={form.dataUltimoContatto} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="number" placeholder="Fatturato Annuale" name="fatturatoAnnuale" value={form.fatturatoAnnuale} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="email" placeholder="PEC" name="pec" value={form.pec} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="tel" placeholder="Telefono" name="telefono" value={form.telefono} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="email" placeholder="Email Contatto" name="emailContatto" value={form.emailContatto} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Nome Contatto" name="nomeContatto" value={form.nomeContatto} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Cognome Contatto" name="cognomeContatto" value={form.cognomeContatto} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="tel" placeholder="Telefono Contatto" name="telefonoContatto" value={form.telefonoContatto} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Logo Aziendale (URL)" name="logoAziendale" value={form.logoAziendale} onChange={handleChange} />
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
            <th>Fatturato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {clienti.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Nessun cliente inserito
              </td>
            </tr>
          ) : (
            clienti.map((c, idx) => (
              <tr key={idx}>
                <td>{c.ragioneSociale}</td>
                <td>{c.partitaIva}</td>
                <td>{c.email}</td>
                <td>{c.fatturatoAnnuale}</td>
                <td></td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default ClientiPage;
