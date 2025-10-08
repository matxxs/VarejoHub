// src/auth/UserTokenData.ts

interface StandardClaims {
  sub: string;
  name: string;
  role: string;
  email: string;
}

interface CustomClaims {
  IsGlobalAdmin: string; 
  SupermarketId: string; 
}

export interface UserTokenData extends StandardClaims, CustomClaims {
  exp: number;
  iat: number;
}