import Container from "react-bootstrap/Container";
import imagePage from "../assets/imagePage.svg";
import { useAuth } from "../AuthContext";

function HomePage() {
  const { user } = useAuth();

  return (
    <Container className="py-4">
      <img src={imagePage} alt="EPIC ENERGY SERVICES Logo" style={{ maxWidth: 130, marginBottom: 16 }} />
      <h1>Benvenuto in EPIC ENERGY SERVICES CRM</h1>
      {user && user.role === "ADMIN" ? (
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
    </Container>
  );
}

export default HomePage;
