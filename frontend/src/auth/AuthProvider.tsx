"use client"

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Supermarket } from '../api/routes/auth';
import { User, getMe } from '../api/routes/users';

const TOKEN_KEY = 'jwt_token';

export type AuthContextType = {
    token: string | null;
    userData: User | null;
    supermarketData: Supermarket | null;
    isAuthenticated: boolean;
    isAuthLoaded: boolean;
    login: (token: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [supermarketData, setSupermarketData] = useState<Supermarket | null>(null);
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);

    const loadUserData = useCallback(async (jwt: string): Promise<boolean> => {
        try {
            setToken(jwt);

            const response = await getMe();

            if (response.isSuccess && response.value) {
                const user = response.value;
                setUserData(user);
                setSupermarketData(user.supermercado || null);
                console.log("Dados do usuário carregados com sucesso.");
                return true;
            } else {
                console.warn("Falha ao carregar dados do usuário com token válido:", response.error);
                return false;
            }

        } catch (error) {
            console.error("Erro crítico ao carregar dados do usuário:", error);
            return false;
        } finally {
            setIsAuthLoaded(true);
        }
    }, []);

    const handleLogin = useCallback(async (jwt: string): Promise<boolean> => {
        Cookies.set(TOKEN_KEY, jwt, { expires: 7, secure: true, sameSite: 'Strict' });
        return await loadUserData(jwt);
    }, [loadUserData]);

    const handleLogout = useCallback(() => {
        setToken(null);
        setUserData(null);
        setSupermarketData(null);
        Cookies.remove(TOKEN_KEY);
        router.push('/'); // <-- 3. Adicionar o redirecionamento
    }, [router]);

    useEffect(() => {
        const storedToken = Cookies.get(TOKEN_KEY);

        if (storedToken) {
            loadUserData(storedToken);
        } else {
            setIsAuthLoaded(true);
        }
    }, [loadUserData]);

    const isAuthenticated = !!token && !!userData;

    return (
        <AuthContext.Provider
            value={{
                token,
                userData,
                supermarketData,
                isAuthenticated,
                isAuthLoaded,
                login: handleLogin,
                logout: handleLogout
            }}
        >
            {isAuthLoaded ? children : null}
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