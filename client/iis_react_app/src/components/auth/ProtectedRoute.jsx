// src/components/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Prikazujemo loader dok se provjerava autentifikacija
  if (isLoading) {
    return <div>Loading...</div>; // Možete zamijeniti sa spinner komponentom
  }

  // Preusmjeravamo na login ako korisnik nije autentificiran
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Prikazujemo zaštićeni sadržaj
  return children;
};

export default ProtectedRoute;
