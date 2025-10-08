// src/auth/decodeToken.ts

import { UserTokenData } from "@/src/auth/user-token-data";


/**
 * Decodifica o payload (carga útil) de um token JWT.
 * @param token O token JWT (string)
 * @returns Os dados do usuário tipados ou null se o token for inválido.
 */
export const decodeToken = (token: string): UserTokenData | null => {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error('Token JWT inválido: O formato esperado é Header.Payload.Signature');
      return null;
    }

    const payloadBase64 = parts[1];
    
    const jsonPayload = decodeURIComponent(atob(payloadBase64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decodedPayload: any = JSON.parse(jsonPayload);

    const userData: UserTokenData = {
      sub: decodedPayload.nameid,
      name: decodedPayload.unique_name || decodedPayload.name, 
      role: decodedPayload.role || decodedPayload.roles, 
      email: decodedPayload.email, 

      IsGlobalAdmin: decodedPayload.IsGlobalAdmin,
      SupermarketId: decodedPayload.SupermarketId,

      exp: decodedPayload.exp,
      iat: decodedPayload.iat,
    };

    return userData;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};