import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import imageRegister from "../assets/imagePage.svg";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    nome: "",
    cognome: "",
    avatarUrl: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    // Validazione base lato client
    if (!form.username || !form.email || !form.password || !form.nome || !form.cognome) {
      setError("Compila tutti i campi obbligatori.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "Errore nella registrazione");
      }
    } catch (err) {
      setError("Errore di connessione");
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 1000 }}>
      <Row className="align-items-center">
        <Col xs={12}>
          <img src={imageRegister} alt="EPIC ENERGY SERVICES Logo" style={{ maxWidth: 110, marginBottom: 16 }} />
          <h2>Registrazione</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" value={form.username} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control name="nome" value={form.nome} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control name="cognome" value={form.cognome} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control name="avatarUrl" value={form.avatarUrl} onChange={handleChange} />
            </Form.Group>
            <Button type="submit" variant="primary">
              Registrati
            </Button>
          </Form>
          {success && <div className="mt-3 text-success">Registrazione avvenuta con successo!</div>}
          {error && <div className="mt-3 text-danger">{error}</div>}
          <div className="mt-3 text-center">
            <Link to="/login">Hai già un account? Accedi</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
