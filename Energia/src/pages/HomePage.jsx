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
  const [clienti, setClienti] = useState([]);
  const fatture = JSON.parse(localStorage.getItem("fatture") || "[]");
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
      const token = String(localStorage.getItem("accesstoken") || "");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3001/clienti", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Clienti fetched:", data);
          setClienti(data);
        }
      } catch (err) {
        // gestisci errore
      }
    }
    fetchClienti();
  }, []);

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
            {showAddCliente ? (
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
                    <Form.Control type="text" name="comune" placeholder="Comune" required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control type="text" name="provincia" placeholder="Provincia" required />
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
                <Row xs={1} md={3} className="g-4">
                  {/* Mostra i clienti filtrati */}
                  {clienti.filter(
                    (c) =>
                      c.ragioneSociale.toLowerCase().includes(search.toLowerCase()) ||
                      c.partitaIva.toLowerCase().includes(search.toLowerCase()) ||
                      c.email.toLowerCase().includes(search.toLowerCase())
                  ).length === 0 ? (
                    <Col>
                      <div className="text-center text-muted">Nessun cliente presente</div>
                    </Col>
                  ) : (
                    clienti
                      .filter(
                        (c) =>
                          c.ragioneSociale.toLowerCase().includes(search.toLowerCase()) ||
                          c.partitaIva.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((cliente, idx) => (
                        <Col key={idx}>
                          <Card className="h-100 text-center">
                            <Card.Img variant="top" src={imagePage} style={{ maxWidth: 60, margin: "0 auto", marginTop: 16 }} />
                            <Card.Body>
                              <Card.Title>{cliente.ragioneSociale}</Card.Title>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                  )}
                </Row>
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
                            <Card className="h-100 text-center">
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
