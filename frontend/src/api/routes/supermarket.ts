import { privateApi } from "../api";
import { Supermarket, Result } from "@/src/types/entities";

export async function getSupermarketById(supermarketId: number): Promise<Result<Supermarket>> {
    try {
        const response = await privateApi.get<Supermarket>(`/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar supermercado",
        };
    }
}

export async function createSupermarket(supermarket: Omit<Supermarket, 'idSupermercado'>): Promise<Result<Supermarket>> {
    try {
        const response = await privateApi.post<Supermarket>('/supermarket', supermarket);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao criar supermercado",
        };
    }
}

export async function updateSupermarket(supermarketId: number, supermarket: Supermarket): Promise<Result<void>> {
    try {
        await privateApi.put(`/supermarket/${supermarketId}`, supermarket);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao atualizar supermercado",
        };
    }
}

export async function deleteSupermarket(supermarketId: number): Promise<Result<void>> {
    try {
        await privateApi.delete(`/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao deletar supermercado",
        };
    }
}
