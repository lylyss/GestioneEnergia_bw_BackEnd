import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./AuthContext";
import "./App.css";
import HomePage from "./pages/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
