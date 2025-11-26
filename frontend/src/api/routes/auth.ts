import { authApi } from '../api';
import {  PlanSummary } from '../routes/plant';
import { User } from '../routes/user';

/**
 * Representa o resultado de uma operação.
 * @template T O tipo do valor retornado em caso de sucesso.
 */
export interface Result<T> {
  isSuccess: boolean; 
  value?: T; 
  
  // A mensagem de erro, presente em caso de falha.
  error: string;
}


// Tipos baseados nos DTOs C#
export interface RegisterRequest {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  nomeAdmin: string;
  emailAdmin: string;
}

export interface EmailRequest {
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  supermarket: Supermarket
}


export interface Supermarket {
  idSupermercado: number;
  nomeFantasia: string;
  plano: PlanSummary
}


export async function register(data: RegisterRequest): Promise<Result<void>> {
  const response = await authApi.post<Result<void>>('/api/auth/register', data);
  return response.data;
}

export async function generateMagicLink(data: EmailRequest): Promise<Result<void>> {
  const response = await authApi.post<Result<void>>('/api/auth/magic-link', data);
  return response.data;
}


export async function magicLogin(token: string): Promise<Result<LoginResponse>> {
  const response = await authApi.get<Result<LoginResponse>>('/api/auth/magic-login', {
    params: { token }
  });

  return response.data;
}