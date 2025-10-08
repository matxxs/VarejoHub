'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { Supermarket, User } from '../api/auth-requests'; 

const TOKEN_KEY = 'jwt_token'; 

export type AuthContextType = {
  token: string | null;
  userData: User | null;
  supermarketData: Supermarket | null;
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  login: (token: string) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Você deve substituir isso pela chamada real à sua API (ex: GET /api/users/me)
async function fetchUserData(token: string): Promise<{ user: User, supermarket: Supermarket }> {
    console.log("Simulando busca de dados do usuário com o token...");
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        user: { email: 'user@exemplo.com', name: 'Nome do Usuário', acessLevel: 'Gerente', globalAdmin: false },
        supermarket: { supermarketId: 101, nameFantasy: 'Super Varejo Hub', status: 'Ativo' }
    };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [supermarketData, setSupermarketData] = useState<Supermarket | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false); 
  
  const loadUserData = async (jwt: string) => {
    try {  
      setToken(jwt);

        const { user, supermarket } = await fetchUserData(jwt);
        
        setUserData(user);
        setSupermarketData(supermarket);
        
        console.log("Dados do usuário carregados com sucesso.");

    } catch (error) {
        console.error("Falha ao carregar dados do usuário com o token:", error);
        handleLogout();
    } finally {
        setIsAuthLoaded(true);
    }
  };

  const handleLogin = (jwt: string) => {
    Cookies.set(TOKEN_KEY, jwt, { expires: 7, secure: true, sameSite: 'Strict' });

    loadUserData(jwt);
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
      loadUserData(storedToken);
    } else {
      setIsAuthLoaded(true);
    }
  }, []); 

  const isAuthenticated = !!token && !!userData; 

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        userData, // Adicionado ao contexto
        supermarketData, // Adicionado ao contexto
        isAuthenticated, 
        isAuthLoaded, 
        login: handleLogin, 
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