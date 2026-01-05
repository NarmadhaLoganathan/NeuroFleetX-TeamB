import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isTokenExpired, getRemainingTokenTime } from "../utils/tokenValidator";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("jwtToken");
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Check if token is already expired
    if (isTokenExpired(parsed.token)) {
      localStorage.removeItem("jwtToken");
      return null;
    }
    
    return parsed;
  });

  const login = (data) => {
    localStorage.setItem("jwtToken", JSON.stringify(data));
    setAuth(data);
  };

  const logout = (showMessage = true) => {
    localStorage.removeItem("jwtToken");
    setAuth(null);
    
    if (showMessage) {
      toast.error("⏱️ Session expired! Please login again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const hasRole = (role) => auth?.role === role;

  // Monitor token expiration
  useEffect(() => {
    if (!auth?.token) return;

    // Check immediately
    if (isTokenExpired(auth.token)) {
      logout();
      return;
    }

    // Set up interval to check token expiration every minute
    const checkInterval = setInterval(() => {
      if (isTokenExpired(auth.token)) {
        logout();
        clearInterval(checkInterval);
      }
    }, 60000); // Check every minute

    // Set up timeout for exact expiration time
    const remainingTime = getRemainingTokenTime(auth.token);
    let expirationTimeout;
    
    if (remainingTime > 0) {
      expirationTimeout = setTimeout(() => {
        logout();
      }, remainingTime);
    }

    return () => {
      clearInterval(checkInterval);
      if (expirationTimeout) clearTimeout(expirationTimeout);
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
