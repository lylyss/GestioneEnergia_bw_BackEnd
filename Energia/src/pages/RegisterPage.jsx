import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
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
    // chiamata API di registrazione
    // try {
    //   await fetch("/api/auth/register", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(form),
    //   });
    //   setSuccess(true);
    // } catch (err) {
    //   setError("Errore nella registrazione");
    // }
    setSuccess(true); // Solo demo
  };

  return (
    <Container className="py-4" style={{ maxWidth: 400 }}>
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
        <Button type="submit" variant="primary">
          Registrati
        </Button>
      </Form>
      {success && <div className="mt-3 text-success">Registrazione avvenuta con successo!</div>}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </Container>
  );
}

export default RegisterPage;
