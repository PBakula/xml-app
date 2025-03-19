const DEBUG = true;
const log = (message, data) => {
  if (DEBUG) {
    console.log(`[apiClient] ${message}`, data || "");
  }
};

const error = (message, err) => {
  if (DEBUG) {
    console.error(`[apiClient] ${message}`, err || "");
  }
};

// Funkcija za refresh tokena - koristi localStorage
const refreshAccessToken = async () => {
  log("Pokušaj refresh tokena");
  try {
    const baseURL = import.meta.env.PROD ? "" : "http://localhost:8087";
    const refreshURL = `${baseURL}/rest/refreshToken`;
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      error("Nema refresh tokena u localStorage");
      return false;
    }

    log("Šaljem zahtjev za refresh tokena na:", refreshURL);

    // Sada šaljemo refresh token u tijelu
    const response = await fetch(refreshURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    log("Status odgovora za refresh:", response.status);

    if (!response.ok) {
      error(`Refresh token zahtjev nije uspio - status: ${response.status}`);
      try {
        const errorData = await response.text();
        error("Detalji greške:", errorData);
      } catch (e) {
        error("Nije moguće pročitati odgovor greške");
      }
      return false;
    }

    // Spremamo novi access token u localStorage
    const tokenData = await response.json();
    localStorage.setItem("accessToken", tokenData.accessToken);
    log("Access token je uspješno osvježen i spremljen u localStorage");
    return true;
  } catch (e) {
    error("Greška prilikom refresh tokena:", e);
    return false;
  }
};

const redirectToLogin = () => {
  log("Preusmjeravanje na login stranicu");
  window.location.href = "/login";
};

export const apiClient = async (url, options = {}) => {
  log(`Početak zahtjeva na: ${url}`, options);

  const accessToken = localStorage.getItem("accessToken");
  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
    },
  };

  if (accessToken) {
    requestOptions.headers = {
      ...requestOptions.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  let isRefreshAttempted = false;

  try {
    log("Šaljem inicijalni zahtjev s postojećim tokenom iz localStorage");
    let response = await fetch(url, requestOptions);
    log("Inicijalni odgovor status:", response.status);

    if (response.status === 401 || response.status === 403) {
      log("Dobiven 401/403, pokušavam refresh tokena");

      if (isRefreshAttempted) {
        error("Refresh već pokušan, preusmjeravam na login");
        redirectToLogin();
        return null;
      }

      isRefreshAttempted = true;

      const isRefreshed = await refreshAccessToken();

      if (isRefreshed) {
        log("Token uspješno refreshan, ponavljam zahtjev");

        const newAccessToken = localStorage.getItem("accessToken");
        requestOptions.headers = {
          ...requestOptions.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        log("Slanje ponovnog zahtjeva s novim tokenom");
        response = await fetch(url, requestOptions);
        log("Status odgovora nakon refresha:", response.status);

        if (response.status === 401 || response.status === 403) {
          error(
            "Autentikacija opet neuspješna nakon refresha, preusmjeravam na login"
          );
          redirectToLogin();
          return null;
        }

        log("Zahtjev uspješan nakon refresha tokena");
        return response;
      } else {
        error("Refresh tokena nije uspio, preusmjeravam na login");
        redirectToLogin();
        return null;
      }
    }

    log("Zahtjev uspješno završen sa statusom:", response.status);
    return response;
  } catch (err) {
    error("API Client greška:", err);
    throw err;
  }
};
