import { createContext, useContext, useState, useEffect } from "react";
import {
  login as loginService,
  logout as logoutService,
  isAuthenticated,
} from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticatedState, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // Funkcija za provjeru autentikacije
  const checkAuthentication = async () => {
    try {
      const authenticated = await isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Provjera autentikacije pri prvom učitavanju
  useEffect(() => {
    checkAuthentication();

    // Periodička provjera svaku minutu
    const interval = setInterval(checkAuthentication, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Login funkcija
  const login = async (username, password) => {
    try {
      const userData = await loginService(username, password);
      setIsAuthenticated(true);
      setUserInfo(userData);
      return userData;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Logout funkcija
  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setUserInfo(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticatedState,
        isLoading,
        userInfo,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
