import { isAxiosError } from "axios"
import { privateApi } from "../api"
import { Supermarket } from "./auth"

export interface Result<T> {
    isSuccess: boolean
    value?: T
    error: string
}


export interface User {
    idUsuario: number
    email: string
    nome: string
    nivelAcesso: 'Administrador' | 'Gerente' | 'Caixa' | 'Financeiro'
    eGlobalAdmin: boolean
    supermercado?: Supermarket
}


export interface UserCreatePayload {
    idSupermercado: number
    email: string
    nome: string
    nivelAcesso: 'Administrador' | 'Gerente' | 'Caixa' | 'Financeiro'
}

export interface UserUpdatePayload {
    idUsuario: number
    idSupermercado: number
    nome: string
    nivelAcesso: 'Administrador' | 'Gerente' | 'Caixa' | 'Financeiro'
}


type ApiError = {
    message: string
}

export async function getMe(): Promise<Result<User>> {
    try {
        const response = await privateApi.get<User>(`/user/me`)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            value: undefined,
            error: error.response?.data?.message || "Erro ao buscar dados do usuário",
        }
    }
}

export async function getUsersBySupermarket(supermarketId: number): Promise<Result<User[]>> {
    try {
        const response = await privateApi.get<User[]>(`/user/supermarket/${supermarketId}`)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            error: error.response?.data?.message || "Erro ao buscar usuários",
        }
    }
}

export async function getUserById(userId: number): Promise<Result<User>> {
    try {
        const response = await privateApi.get<User>(`/user/${userId}`)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            error: error.response?.data?.message || "Erro ao buscar usuário por id",
        }
    }
}


export async function createUser(data: UserCreatePayload): Promise<Result<User>> {
    try {
        // Endpoint [HttpPost] em /user
        const response = await privateApi.post<User>("/user", data)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error) {
        const defaultError = "Erro ao criar usuário"
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message }
        }
        return { isSuccess: false, error: defaultError }
    }
}

export async function updateUser(userId: number, data: UserUpdatePayload): Promise<Result<void>> {
    try {
        const response = await privateApi.put<void>(`/user/${userId}`, data)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error) {
        const defaultError = "Erro ao atualizar usuário"
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message }
        }
        return { isSuccess: false, error: defaultError }
    }
}

export async function deleteUser(userId: number): Promise<Result<void>> {
    try {
        const response = await privateApi.delete<void>(`/user/${userId}`)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error) {
        const defaultError = "Erro ao deletar o usuário"
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message }
        }
        return { isSuccess: false, error: defaultError }
    }
}