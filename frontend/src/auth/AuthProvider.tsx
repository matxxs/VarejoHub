'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { Supermarket } from '../api/auth/auth-requests'; 
import { User, getMe } from '../api/management/user'; // Verifique se a interface User está correta

const TOKEN_KEY = 'jwt_token'; 

export type AuthContextType = {
  token: string | null;
  userData: User | null;
  supermarketData: Supermarket | null;
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  // AJUSTE: 'login' agora retorna uma promessa que resolve para 'boolean'
  login: (token: string) => Promise<boolean>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [supermarketData, setSupermarketData] = useState<Supermarket | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false); 
  
  // AJUSTE: loadUserData agora retorna true/false indicando o sucesso
  const loadUserData = async (jwt: string): Promise<boolean> => {
    try {   
      setToken(jwt); 

      const response = await getMe(); 
      
      if (response.isSuccess && response.value) {
        const user = response.value;
        setUserData(user);
        
        // CORREÇÃO DE BUG: A propriedade no JSON é 'supermercado' (minúsculo)
        setSupermarketData(user.supermercado); 
        
        console.log("Dados do usuário carregados com sucesso.");
        return true; // Sucesso
      } else {
        console.error("Falha ao carregar dados do usuário:", response.error);
        handleLogout();
        return false; // Falha
      }

    } catch (error) {
      console.error("Erro crítico ao carregar dados do usuário:", error);
      handleLogout();
      return false; // Falha
    } finally {
      // Mesmo que falhe, a autenticação foi "carregada" (como falha)
      setIsAuthLoaded(true);
    }
  };

  // AJUSTE: handleLogin agora é 'async' e repassa o resultado (true/false) do loadUserData
  const handleLogin = async (jwt: string): Promise<boolean> => {
    Cookies.set(TOKEN_KEY, jwt, { expires: 7, secure: true, sameSite: 'Strict' });
    // 'await' e retorna o resultado booleano
    return await loadUserData(jwt); 
  };

  const handleLogout = () => {
    setToken(null);
    setUserData(null);
    setSupermarketData(null);
    Cookies.remove(TOKEN_KEY);
  };

  useEffect(() => {
    const storedToken = Cookies.get(TOKEN_KEY);

    if (storedToken) {
      loadUserData(storedToken); // Aqui não precisamos do 'await'
    } else {
      setIsAuthLoaded(true); 
    }
  }, []); 

  const isAuthenticated = !!token && !!userData; 

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        userData,
        supermarketData,
        isAuthenticated, 
        isAuthLoaded, 
        login: handleLogin, // Passa a nova função 'async'
        logout: handleLogout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};