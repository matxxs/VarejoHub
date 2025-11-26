import { privateApi } from "../api";
import { Sale, Result } from "@/src/types/entities";

export async function getSalesBySupermarket(supermarketId: number): Promise<Result<Sale[]>> {
    try {
        const response = await privateApi.get<Sale[]>(`/sale/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar vendas",
        };
    }
}

export async function getSaleById(saleId: number): Promise<Result<Sale>> {
    try {
        const response = await privateApi.get<Sale>(`/sale/${saleId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar venda",
        };
    }
}

export async function createSale(sale: Omit<Sale, 'idVenda'>): Promise<Result<Sale>> {
    try {
        const response = await privateApi.post<Sale>('/sale', sale);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao criar venda",
        };
    }
}

// Note: Sales are immutable after creation according to business rules
// Update and delete operations are not provided
