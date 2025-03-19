import { useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/validation");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
      navigate("/validation");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <h1 className="h4 mb-4">Login</h1>
          <LoginForm onSubmit={handleLogin} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
