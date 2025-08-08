import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import imageRegister from "../assets/imagePage.svg";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // login solo con email e password
    const payload = { email: form.email, password: form.password };
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Login response:", data); // <-- aggiunto log
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          login(data.user);
          navigate("/home");
        } else {
          setError(data.message || "Credenziali non valide");
        }
      } else {
        const data = await res.json();
        console.log("Login error response:", data); // <-- aggiunto log
        setError(data.message || "Credenziali non valide");
      }
    } catch (err) {
      setError("Errore di connessione");
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 400 }}>
      <img src={imageRegister} alt="EPIC ENERGY SERVICES Logo" style={{ maxWidth: 110, marginBottom: 16 }} />
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="primary">
          Accedi
        </Button>
      </Form>
      <div className="mt-3">
        <Link to="/register">Non hai un account? Registrati</Link>
      </div>
      {error && <div className="mt-3 text-danger">{error}</div>}
    </Container>
  );
}

export default LoginPage;
