import { managementApi } from "../api"
import { Supermarket } from "../auth/auth-requests";

export interface Result<T> {
    isSuccess: boolean
    value?: T
    error: string
}

export interface User {
    idUsuario: number,
    email: string,
    nome: string,
    nivelAcesso: 'Administrador' | 'Gerente' | 'Caixa' | 'Financeiro',
    eGlobalAdmin: boolean,
    supermercado: Supermarket
}

export async function getMe(): Promise<Result<User>> {
    try {
        const response = await managementApi.get<User>(`/user/me`)

        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: unknown) {
        return {
            isSuccess: false,
            value: undefined, 
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar dados do usuário",
        }
    }
}

export async function getUsersBySupermarket(supermarketId: number): Promise<Result<User[]>> {
    try {
        const response = await managementApi.get<User[]>(`/user/supermarket/${supermarketId}/users`)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar usuários",
        }
    }
}


export async function getUserById(productId: number): Promise<Result<User>> { 
    try {
        const response = await managementApi.get<User>(`/user /${productId}`)

        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar usuário por id",
        }
    }
}