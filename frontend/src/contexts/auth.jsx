import { createContext, useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from 'react-toastify';

export const AuthContext = createContext();

const STORE_KEY = '@BarberConnect:Auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setDefaultAuthorization = useCallback((token) => {
    api.defaults.headers.authorization = `Bearer ${token}`;
  }, []);

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORE_KEY);

    if (!storedAuth) return;

    const parsedStoredAuth = JSON.parse(storedAuth);

    setDefaultAuthorization(parsedStoredAuth.token);
    setUser(parsedStoredAuth.user);
  }, [setDefaultAuthorization]);

  const storeAuthData = useCallback((data) => {
    const parsedData = JSON.stringify(data);

    localStorage.setItem(STORE_KEY, parsedData);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post(
      `/users/session`,
      { email, password }
    );

    const { token, user } = data;

    if (user.access !== 2) {
      toast('Você não tem permissão para acessar este recurso!', {
        type: 'error',
      });
      return;
    }

    const authToStore = { user, token };

    storeAuthData(authToStore);
    setDefaultAuthorization(token);
    setUser(user);
  }, [storeAuthData, setDefaultAuthorization]);

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

    storeAuthData(newDataToStore);
    setUser(updatedUser);
  }, [storeAuthData]);

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
