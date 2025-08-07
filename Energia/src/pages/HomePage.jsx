import Container from "react-bootstrap/Container";
import imagePage from "../assets/imagePage.svg";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";

function HomePage() {
  const { user } = useAuth();
  const [openClienti, setOpenClienti] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 100,
          background: "#fff",
          borderRight: "1px solid #eee",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 25,
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
            <li style={{ margin: "16px 0", position: "relative" }}>
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
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    minWidth: 120,
                    zIndex: 10,
                  }}
                >
                  <li>
                    <Link
                      to="/clienti"
                      style={{
                        display: "block",
                        padding: "8px 16px",
                        color: "#333",
                        textDecoration: "none",
                      }}
                    >
                      Lista Clienti
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/fatture"
                      style={{
                        display: "block",
                        padding: "8px 16px",
                        color: "#333",
                        textDecoration: "none",
                      }}
                    >
                      Lista Fatture
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <div style={{ flex: 1 }}>
        <Container className="py-4 d-flex flex-column min-vh-100 justify-content-between">
          {/* Header */}
          <header className="mb-4">
            <h1>Benvenuto in EPIC ENERGY SERVICES CRM</h1>
          </header>
          {/* Main */}
          <main className="flex-grow-1">
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
