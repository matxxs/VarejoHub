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


export async function getMe() {
    try {
        const response = await managementApi.get<User>(`/user/me`)

        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            value: null,
            error: error.response?.data?.message || "Erro ao buscar dados do usuário",
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
    } catch (error: any) {
        return {
            isSuccess: false,
            error: error.response?.data?.message || "Erro ao buscar produtos",
        }
    }
}


export async function getUserById(productId: number) {
    try {
        const response = await managementApi.get<User>(`/user /${productId}`)

        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            error: error.response?.data?.message || "Erro ao buscar produto por id",
        }
    }
}