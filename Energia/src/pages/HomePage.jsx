import Container from "react-bootstrap/Container";
import imagePage from "../assets/imagePage.svg";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function HomePage() {
  const { user } = useAuth();
  const [openClienti, setOpenClienti] = useState(false);
  const [showClientiList, setShowClientiList] = useState(false);
  const [search, setSearch] = useState("");
  const [showFattureList, setShowFattureList] = useState(false);
  const [fattureSearch, setFattureSearch] = useState("");
  const [showAddCliente, setShowAddCliente] = useState(false);
  const [showAddFattura, setShowAddFattura] = useState(false);
  const [clienti, setClienti] = useState([]);
  const [fatture, setFatture] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedFattura, setSelectedFattura] = useState(null);
  const [editFattura, setEditFattura] = useState(null);
  const [comuni, setComuni] = useState([]);
  const [province, setProvince] = useState([]);
  const [ordineAsc, setOrdineAsc] = useState(true);
  const [letteraFiltro, setLetteraFiltro] = useState("");
  const clientiMenuRef = useRef();

  // Chiudi il menu a discesa quando clicchi fuori
  useEffect(() => {
    function handleClickOutside(event) {
      if (clientiMenuRef.current && !clientiMenuRef.current.contains(event.target)) {
        setOpenClienti(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchClienti() {
      const token = String(localStorage.getItem("token") || "");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3001/clienti", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          let data;
          try {
            data = await res.json();
          } catch (jsonErr) {
            console.error("Risposta non JSON dalla fetch clienti:", jsonErr);
            setClienti([]);
            return;
          }
          console.log("Clienti fetched:", data);
          // Gestione struttura { content: [...] }
          if (Array.isArray(data)) {
            setClienti(data);
          } else if (data && Array.isArray(data.content)) {
            setClienti(data.content);
          } else {
            console.warn("Nessun cliente trovato o risposta non valida", data);
            setClienti([]);
          }
        } else {
          console.error("Errore nella fetch clienti:", res.status, await res.text());
        }
      } catch (err) {
        console.error("Errore di rete/fetch clienti:", err);
      }
    }
    async function fetchFatture() {
      const token = String(localStorage.getItem("token") || "");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3001/fatture", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          let data;
          try {
            data = await res.json();
          } catch (jsonErr) {
            console.error("Risposta non JSON dalla fetch fatture:", jsonErr);
            setFatture([]);
            return;
          }
          console.log("Fatture fetched:", data);
          // Gestione struttura { content: [...] }
          if (Array.isArray(data)) {
            setFatture(data);
          } else if (data && Array.isArray(data.content)) {
            setFatture(data.content);
          } else {
            console.warn("Nessuna fattura trovata o risposta non valida", data);
            setFatture([]);
          }
        } else {
          console.error("Errore nella fetch fatture:", res.status, await res.text());
        }
      } catch (err) {
        console.error("Errore di rete/fetch fatture:", err);
      }
    }
    async function fetchComuni() {
      try {
        const res = await fetch("http://localhost:3001/comuni");
        if (res.ok) {
          const data = await res.json();
          setComuni(Array.isArray(data) ? data : data.content || []);
        }
      } catch {}
    }
    async function fetchProvince() {
      try {
        const res = await fetch("http://localhost:3001/province");
        if (res.ok) {
          const data = await res.json();
          setProvince(Array.isArray(data) ? data : data.content || []);
        }
      } catch {}
    }
    fetchClienti();
    fetchFatture();
    fetchComuni();
    fetchProvince();
  }, []);

  // Funzione per ordinare i clienti per ragione sociale
  const clientiOrdinati = [...clienti].sort((a, b) => {
    const nomeA = a.ragioneSociale?.toLowerCase() || "";
    const nomeB = b.ragioneSociale?.toLowerCase() || "";
    if (nomeA < nomeB) return ordineAsc ? -1 : 1;
    if (nomeA > nomeB) return ordineAsc ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 120,
          height: "100vh",
          background: "#fff",
          borderRight: "2px solid #eee",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 25,
          zIndex: 1000,
        }}
      >
        <img src={imagePage} alt="EPIC ENERGY SERVICES Logo" style={{ maxWidth: 60, marginBottom: 20 }} />
        <nav style={{ width: "100%" }}>
          <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
            <li style={{ margin: "16px 0" }}>
              <Link to="/profile" style={{ textDecoration: "none", color: "#333", fontWeight: 500 }}>
                Profilo
              </Link>
            </li>
            <li style={{ margin: "16px 0", position: "relative" }} ref={clientiMenuRef}>
              <span style={{ cursor: "pointer", textDecoration: "none", color: "#333", fontWeight: 500 }} onClick={() => setOpenClienti((v) => !v)}>
                Clienti
              </span>
              {openClienti && (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    position: "absolute",
                    left: "100%",
                    top: 0,
                    background: "#fff",
                    border: "1px solid #eee",
                    boxShadow: "0 2px 8px rgba(19, 17, 17, 0.08)",
                    minWidth: 130,
                    zIndex: 10,
                  }}
                >
                  <li>
                    <span
                      style={{
                        display: "block",
                        padding: "8px 16px",
                        color: "#333",
                        textDecoration: "none",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowClientiList(true);
                        setShowFattureList(false);
                        setShowAddCliente(false);
                        setOpenClienti(false);
                      }}
                    >
                      Lista Clienti
                    </span>
                  </li>
                  <li>
                    <span
                      style={{
                        display: "block",
                        padding: "8px 16px",
                        color: "#333",
                        textDecoration: "none",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowFattureList(true);
                        setShowClientiList(false);
                        setShowAddCliente(false);
                        setOpenClienti(false);
                      }}
                    >
                      Lista Fatture
                    </span>
                  </li>
                  <li>
                    <span
                      style={{
                        display: "block",
                        padding: "8px 16px",
                        color: "#333",
                        textDecoration: "none",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowAddCliente(true);
                        setShowClientiList(false);
                        setShowFattureList(false);
                        setOpenClienti(false);
                      }}
                    >
                      Aggiungi clienti
                    </span>
                  </li>
                  <li>
                    <span
                      style={{
                        display: "block",
                        padding: "8px 16px",
                        color: "#333",
                        textDecoration: "none",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowAddFattura(true);
                        setShowClientiList(false);
                        setShowFattureList(false);
                        setShowAddCliente(false);
                        setOpenClienti(false);
                      }}
                    >
                      Aggiungi fattura
                    </span>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <div style={{ marginLeft: 120 }}>
        <Container className="py-4 d-flex flex-column min-vh-100 justify-content-between">
          {/* Header */}
          <header className="mb-4">
            <h1>Benvenuto in EPIC ENERGY SERVICES CRM</h1>
          </header>
          {/* Main */}
          <main className="flex-grow-1">
            {showAddFattura ? (
              <>
                <h4 className="mb-3">Aggiungi nuova fattura</h4>
                <Form
                  style={{ maxWidth: 500 }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const nuovaFattura = {
                      numero: formData.get("numero"),
                      data: formData.get("data"),
                      importo: formData.get("importo"),
                      clienteId: formData.get("clienteId"),
                    };
                    const statoFattura = formData.get("statoFattura");
                    const token = String(localStorage.getItem("token") || "");
                    try {
                      const res = await fetch("http://localhost:3001/fatture", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(nuovaFattura),
                      });
                      if (res.ok) {
                        const fatturaCreata = await res.json();
                        // Salva lo stato della fattura
                        await fetch("http://localhost:3001/statofatture/salvastatofattura", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            stato: statoFattura,
                            fatturaId: fatturaCreata.id || fatturaCreata.fatturaId || fatturaCreata.idFattura,
                          }),
                        });
                        alert("Fattura aggiunta!");
                        e.target.reset();
                        setShowAddFattura(false);
                        // Aggiorna la lista fatture
                        const fattureRes = await fetch("http://localhost:3001/fatture", {
                          method: "GET",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        });
                        if (fattureRes.ok) {
                          let data = await fattureRes.json();
                          setFatture(Array.isArray(data) ? data : data.content || []);
                        }
                      } else {
                        alert("Errore nell'aggiunta della fattura");
                      }
                    } catch (err) {
                      alert("Errore di rete");
                    }
                  }}
                >
                  <Form.Group className="mb-2">
                    <Form.Control type="text" name="numero" placeholder="Numero fattura" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Data</Form.Label>
                    <Form.Control type="date" name="data" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="number" name="importo" placeholder="Importo" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Cliente</Form.Label>
                    <Form.Select name="clienteId" required>
                      <option value="">Seleziona cliente...</option>
                      {clienti.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.ragioneSociale}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Stato Fattura</Form.Label>
                    <Form.Select name="statoFattura" required>
                      <option value="">Seleziona stato...</option>
                      <option value="PAGATA">PAGATA</option>
                      <option value="NON PAGATA">NON PAGATA</option>
                      <option value="IN ATTESA">IN ATTESA</option>
                    </Form.Select>
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Aggiungi fattura
                  </Button>
                  <Button className="ms-2" variant="secondary" onClick={() => setShowAddFattura(false)}>
                    Annulla
                  </Button>
                </Form>
              </>
            ) : showAddCliente ? (
              <>
                <h4 className="mb-3">Aggiungi nuovo cliente</h4>
                <Form
                  style={{ maxWidth: 500 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const nuovoCliente = {
                      ragioneSociale: formData.get("ragioneSociale"),
                      partitaIva: formData.get("partitaIva"),
                      email: formData.get("email"),
                      dataInserimento: formData.get("dataInserimento"),
                      dataUltimoContatto: formData.get("dataUltimoContatto"),
                      fatturatoAnnuale: formData.get("fatturatoAnnuale"),
                      pec: formData.get("pec"),
                      telefono: formData.get("telefono"),
                      emailContatto: formData.get("emailContatto"),
                      nomeContatto: formData.get("nomeContatto"),
                      cognomeContatto: formData.get("cognomeContatto"),
                      telefonoContatto: formData.get("telefonoContatto"),
                      logoAziendale: formData.get("logoAziendale"),
                      sede: {
                        indirizzo: formData.get("indirizzo"),
                        comune: formData.get("comune"),
                        provincia: formData.get("provincia"),
                        tipoSede: formData.get("tipoSede"),
                      },
                    };
                    const clientiSalvati = JSON.parse(localStorage.getItem("clienti") || "[]");
                    localStorage.setItem("clienti", JSON.stringify([...clientiSalvati, nuovoCliente]));
                    e.target.reset();
                    alert("Cliente aggiunto!");
                  }}
                >
                  <Form.Group className="mb-2">
                    <Form.Control type="text" name="ragioneSociale" placeholder="Ragione Sociale" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="text" name="partitaIva" placeholder="Partita IVA" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="email" name="email" placeholder="Email" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Data Inserimento</Form.Label>
                    <Form.Control type="date" name="dataInserimento" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Data Ultimo Contatto</Form.Label>
                    <Form.Control type="date" name="dataUltimoContatto" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="number" name="fatturatoAnnuale" placeholder="Fatturato Annuale" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="email" name="pec" placeholder="PEC" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="tel" name="telefono" placeholder="Telefono" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="email" name="emailContatto" placeholder="Email Contatto" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="text" name="nomeContatto" placeholder="Nome Contatto" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="text" name="cognomeContatto" placeholder="Cognome Contatto" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="tel" name="telefonoContatto" placeholder="Telefono Contatto" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="text" name="logoAziendale" placeholder="Logo Aziendale (URL)" />
                  </Form.Group>
                  <hr />
                  <h5 className="mb-2">Sede</h5>
                  <Form.Group className="mb-2">
                    <Form.Control type="text" name="indirizzo" placeholder="Indirizzo" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Comune</Form.Label>
                    <Form.Select name="comune" required>
                      <option value="">Seleziona comune...</option>
                      {comuni.map((c) => (
                        <option key={c.id || c.nome} value={c.nome || c}>
                          {c.nome || c}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Provincia</Form.Label>
                    <Form.Select name="provincia" required>
                      <option value="">Seleziona provincia...</option>
                      {province.map((p) => (
                        <option key={p.id || p.nome} value={p.nome || p}>
                          {p.nome || p}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="text" name="tipoSede" placeholder="Tipo Sede (es. Legale, Operativa)" required />
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Aggiungi
                  </Button>
                </Form>
              </>
            ) : showClientiList ? (
              <>
                <Form className="mb-4" style={{ maxWidth: 400 }}>
                  <Form.Control
                    type="text"
                    placeholder="Cerca cliente per nome, partita IVA o email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Form>
                <Form className="mb-3" style={{ maxWidth: 120 }}>
                  <Form.Control
                    type="text"
                    maxLength={1}
                    placeholder="Lettera..."
                    value={letteraFiltro}
                    onChange={(e) => setLetteraFiltro(e.target.value.toUpperCase())}
                  />
                </Form>
                <Button className="mb-3" variant="outline-primary" onClick={() => setOrdineAsc((v) => !v)}>
                  Ordina per Ragione Sociale {ordineAsc ? "(A-Z)" : "(Z-A)"}
                </Button>
                <Row xs={1} md={3} className="g-4">
                  {/* Mostra i clienti filtrati */}
                  {clientiOrdinati.filter((c) => {
                    const matchSearch =
                      c.ragioneSociale.toLowerCase().includes(search.toLowerCase()) ||
                      c.partitaIva.toLowerCase().includes(search.toLowerCase()) ||
                      c.email.toLowerCase().includes(search.toLowerCase());
                    const matchLettera = !letteraFiltro || (c.ragioneSociale && c.ragioneSociale[0].toUpperCase() === letteraFiltro);
                    return matchSearch && matchLettera;
                  }).length === 0 ? (
                    <Col>
                      <div className="text-center text-muted">Nessun cliente presente</div>
                    </Col>
                  ) : (
                    clientiOrdinati
                      .filter((c) => {
                        const matchSearch =
                          c.ragioneSociale.toLowerCase().includes(search.toLowerCase()) ||
                          c.partitaIva.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase());
                        const matchLettera = !letteraFiltro || (c.ragioneSociale && c.ragioneSociale[0].toUpperCase() === letteraFiltro);
                        return matchSearch && matchLettera;
                      })
                      .map((cliente, idx) => (
                        <Col key={idx}>
                          <Card className="h-100 text-center" style={{ cursor: "pointer" }} onClick={() => setSelectedCliente(cliente)}>
                            <Card.Img variant="top" src={imagePage} style={{ maxWidth: 60, margin: "0 auto", marginTop: 16 }} />
                            <Card.Body>
                              <Card.Title>{cliente.ragioneSociale}</Card.Title>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                  )}
                </Row>
                {selectedCliente && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <h5>Dettagli Cliente</h5>
                    <div>
                      <strong>Ragione Sociale:</strong> {selectedCliente.ragioneSociale}
                    </div>
                    <div>
                      <strong>Partita IVA:</strong> {selectedCliente.partitaIva}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedCliente.email}
                    </div>
                    <div>
                      <strong>PEC:</strong> {selectedCliente.pec}
                    </div>
                    <div>
                      <strong>Telefono:</strong> {selectedCliente.telefono}
                    </div>
                    <div>
                      <strong>Fatturato Annuale:</strong> {selectedCliente.fatturatoAnnuale}
                    </div>
                    <div>
                      <strong>Data Inserimento:</strong> {selectedCliente.dataInserimento}
                    </div>
                    <div>
                      <strong>Data Ultimo Contatto:</strong> {selectedCliente.dataUltimoContatto}
                    </div>
                    <div>
                      <strong>Contatto:</strong> {selectedCliente.nomeContatto} {selectedCliente.cognomeContatto} ({selectedCliente.emailContatto},{" "}
                      {selectedCliente.telefonoContatto})
                    </div>
                    <div>
                      <strong>Logo Aziendale:</strong> {selectedCliente.logoAziendale}
                    </div>

                    <Button className="mt-2" variant="secondary" onClick={() => setSelectedCliente(null)}>
                      Chiudi
                    </Button>
                  </div>
                )}
              </>
            ) : showFattureList ? (
              <>
                <Form className="mb-4" style={{ maxWidth: 400 }}>
                  <Form.Control
                    type="text"
                    placeholder="Cerca per ragione sociale o partita IVA..."
                    value={fattureSearch}
                    onChange={(e) => setFattureSearch(e.target.value)}
                  />
                </Form>
                <Row xs={1} md={3} className="g-4">
                  {fatture.filter((f) => {
                    const cliente = clienti.find((c) => c.id?.toString() === f.clienteId?.toString());
                    return (
                      (cliente?.ragioneSociale?.toLowerCase() || "").includes(fattureSearch.toLowerCase()) ||
                      (cliente?.partitaIva?.toLowerCase() || "").includes(fattureSearch.toLowerCase())
                    );
                  }).length === 0 ? (
                    <Col>
                      <div className="text-center text-muted">Nessuna fattura presente</div>
                    </Col>
                  ) : (
                    fatture
                      .filter((f) => {
                        const cliente = clienti.find((c) => c.id?.toString() === f.clienteId?.toString());
                        return (
                          (cliente?.ragioneSociale?.toLowerCase() || "").includes(fattureSearch.toLowerCase()) ||
                          (cliente?.partitaIva?.toLowerCase() || "").includes(fattureSearch.toLowerCase())
                        );
                      })
                      .map((fattura, idx) => {
                        const cliente = clienti.find((c) => c.id?.toString() === fattura.clienteId?.toString());
                        return (
                          <Col key={idx}>
                            <Card className="h-100 text-center" style={{ cursor: "pointer" }} onClick={() => setSelectedFattura({ ...fattura, cliente })}>
                              <Card.Body>
                                <Card.Title>Fattura n. {fattura.numero}</Card.Title>
                                <div style={{ fontSize: 14 }}>
                                  <div>
                                    <strong>Cliente:</strong> {cliente?.ragioneSociale || "-"}
                                  </div>
                                  <div>
                                    <strong>Partita IVA:</strong> {cliente?.partitaIva || "-"}
                                  </div>
                                  <div>
                                    <strong>Data:</strong> {fattura.data}
                                  </div>
                                  <div>
                                    <strong>Importo:</strong> {fattura.importo}
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })
                  )}
                </Row>
                {selectedFattura && !editFattura && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <h5>Dettagli Fattura</h5>
                    <div>
                      <strong>Numero:</strong> {selectedFattura.numero}
                    </div>
                    <div>
                      <strong>Data:</strong> {selectedFattura.data}
                    </div>
                    <div>
                      <strong>Importo:</strong> {selectedFattura.importo}
                    </div>
                    <div>
                      <strong>Cliente:</strong> {selectedFattura.cliente?.ragioneSociale}
                    </div>
                    <div>
                      <strong>Partita IVA:</strong> {selectedFattura.cliente?.partitaIva}
                    </div>
                    <div>
                      <strong>Email Cliente:</strong> {selectedFattura.cliente?.email}
                    </div>
                    <Button className="mt-2 me-2" variant="warning" onClick={() => setEditFattura(selectedFattura)}>
                      Modifica
                    </Button>
                    <Button className="mt-2" variant="secondary" onClick={() => setSelectedFattura(null)}>
                      Chiudi
                    </Button>
                  </div>
                )}
                {editFattura && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <h5>Modifica Fattura</h5>
                    <Form
                      style={{ maxWidth: 500 }}
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const updatedFattura = {
                          numero: formData.get("numero"),
                          data: formData.get("data"),
                          importo: formData.get("importo"),
                          clienteId: formData.get("clienteId"),
                        };
                        const token = String(localStorage.getItem("token") || "");
                        try {
                          const res = await fetch(`http://localhost:3001/fatture/${editFattura.id || editFattura.fatturaId || editFattura.idFattura}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(updatedFattura),
                          });
                          if (res.ok) {
                            alert("Fattura aggiornata!");
                            setEditFattura(null);
                            setSelectedFattura(null);
                            // Aggiorna la lista fatture
                            const fattureRes = await fetch("http://localhost:3001/fatture", {
                              method: "GET",
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                              },
                            });
                            if (fattureRes.ok) {
                              let data = await fattureRes.json();
                              setFatture(Array.isArray(data) ? data : data.content || []);
                            }
                          } else {
                            alert("Errore nell'aggiornamento della fattura");
                          }
                        } catch {
                          alert("Errore di rete");
                        }
                      }}
                    >
                      <Form.Group className="mb-2">
                        <Form.Control type="text" name="numero" defaultValue={editFattura.numero} required />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Data</Form.Label>
                        <Form.Control type="date" name="data" defaultValue={editFattura.data} required />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Control type="number" name="importo" defaultValue={editFattura.importo} required />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Select name="clienteId" defaultValue={editFattura.clienteId} required>
                          <option value="">Seleziona cliente...</option>
                          {clienti.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.ragioneSociale}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        Salva modifiche
                      </Button>
                      <Button className="ms-2" variant="secondary" onClick={() => setEditFattura(null)}>
                        Annulla
                      </Button>
                    </Form>
                  </div>
                )}
              </>
            ) : user && user.role === "ADMIN" ? (
              <p>
                Sei autenticato come <strong>ADMIN</strong>. Hai accesso alle funzionalità di amministrazione.
              </p>
            ) : user ? (
              <p>
                Sei autenticato come <strong>USER</strong>. Benvenuto nella tua area personale.
              </p>
            ) : (
              <p>Effettua il login per accedere alle funzionalità.</p>
            )}
          </main>
          {/* Footer */}
          <footer className="mt-4 text-muted" style={{ fontSize: 14 }}>
            &copy; {new Date().getFullYear()} EPIC ENERGY SERVICES
          </footer>
        </Container>
      </div>
    </div>
  );
}

export default HomePage;
