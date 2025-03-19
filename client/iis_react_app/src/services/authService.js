// src/services/authService.js
import { apiClient } from "./apiClient";

const baseURL = import.meta.env.PROD ? "" : "http://localhost:8087";

export const login = async (username, password) => {
  try {
    const response = await fetch(`${baseURL}/rest/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.token);

    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${baseURL}/rest/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const isAuthenticated = async () => {
  try {
    if (!localStorage.getItem("accessToken")) {
      return false;
    }

    const response = await fetch(`${baseURL}/rest/validateToken`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
