import axios from "axios";
import { useState, useEffect, createContext } from "react";

import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, [user]);

  // Login user
  const login = async ({ username, password }) => {
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/signin", {
        username,
        password,
      });

      if (res.data.success) {
        loadUser();
        setIsAuthenticated(true);
        setLoading(false);
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Register user
  const signup = async ({ email, password }) => {
    try {
      setLoading(true);

      const res = await axios.post(`${process.env.API_URL}/api/signup/`, {
        email,
        password,
      });

      if (res.data.message) {
        setLoading(false);
        router.push("/signin");
      }
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  const updateProfile = async ({ email, password }, access_token) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.API_URL}/api/user/update/`,
        {
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data) {
        setLoading(false);
        setUpdated(true);
        setUser(res.data);
      }
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/auth/user");

      if (res.data.user) {
        setIsAuthenticated(true);
        setLoading(false);
        setUser(res.data.user);
      }
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");

      if (res.data.success) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Clear Errors
  const clearErrors = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        error,
        isAuthenticated,
        updated,
        login,
        signup,
        updateProfile,
        logout,
        clearErrors,
        setUpdated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
