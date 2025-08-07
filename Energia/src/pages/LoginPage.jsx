import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

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
    // chiamata API di login
    // try {
    //   const res = await fetch("/api/auth/login", { ... });
    //   const userData = await res.json();
    //   login(userData);
    //   navigate("/home");
    // } catch (err) {
    //   setError("Credenziali non valide");
    // }
    //login fittizio
    login({ email: form.email, username: "DemoUser", role: "USER" });
    navigate("/home");
  };

  return (
    <Container className="py-4" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
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
