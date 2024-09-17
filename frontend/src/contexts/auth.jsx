import { createContext, useCallback, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

const STORE_KEY = '@BarberConnect:Auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORE_KEY);

    if (!storedAuth) return;

    const parsedStoredAuth = JSON.parse(storedAuth);

    api.defaults.headers.authorization = `Bearer ${parsedStoredAuth.token}`;

    setUser(parsedStoredAuth.user);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post(
      `/users/session`,
      { email, password }
    );

    const { token, user } = data;
    const authToStore = { user, token };

    localStorage.setItem(STORE_KEY, JSON.stringify(authToStore));

    setUser(user);
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem(STORE_KEY);

    setUser(null);
  }, []);

  const updateUser = useCallback(async data => {
    const { data: updatedUser } = await api.put('/users', data);

    const storedData = localStorage.getItem(STORE_KEY) || '{}';
    const parsedStoredData = JSON.parse(storedData);

    const newDataToStore = {
      token: parsedStoredData.token,
      user: updatedUser,
    };

    localStorage.setItem(STORE_KEY, JSON.stringify(newDataToStore));

    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
