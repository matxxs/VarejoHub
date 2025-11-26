import { privateApi } from "../api";
import { StockMovement, Result } from "@/src/types/entities";

export async function getStockMovementsBySupermarket(supermarketId: number): Promise<Result<StockMovement[]>> {
    try {
        const response = await privateApi.get<StockMovement[]>(`/stockmovement/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar movimentações de estoque",
        };
    }
}

export async function getStockMovementById(movementId: number): Promise<Result<StockMovement>> {
    try {
        const response = await privateApi.get<StockMovement>(`/stockmovement/${movementId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar movimentação de estoque",
        };
    }
}

export async function createStockMovement(movement: Omit<StockMovement, 'idMovimentacao'>): Promise<Result<StockMovement>> {
    try {
        const response = await privateApi.post<StockMovement>('/stockmovement', movement);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao criar movimentação de estoque",
        };
    }
}

export async function updateStockMovement(movementId: number, movement: StockMovement): Promise<Result<void>> {
    try {
        await privateApi.put(`/stockmovement/${movementId}`, movement);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao atualizar movimentação de estoque",
        };
    }
}

export async function deleteStockMovement(movementId: number): Promise<Result<void>> {
    try {
        await privateApi.delete(`/stockmovement/${movementId}`);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao deletar movimentação de estoque",
        };
    }
}

export async function getStockMovementsByProduct(supermarketId: number, productId: number): Promise<Result<StockMovement[]>> {
    try {
        const response = await privateApi.get<StockMovement[]>(`/stockmovement/supermarket/${supermarketId}/product/${productId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar movimentações de estoque do produto",
        };
    }
}
