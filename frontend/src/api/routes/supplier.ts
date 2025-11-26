import { privateApi } from "../api";
import { Supplier, Result } from "@/src/types/entities";

export async function getSuppliersBySupermarket(supermarketId: number): Promise<Result<Supplier[]>> {
    try {
        const response = await privateApi.get<Supplier[]>(`/supplier/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar fornecedores",
        };
    }
}

export async function getSupplierById(supplierId: number): Promise<Result<Supplier>> {
    try {
        const response = await privateApi.get<Supplier>(`/supplier/${supplierId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar fornecedor",
        };
    }
}

export async function createSupplier(supplier: Omit<Supplier, 'idFornecedor'>): Promise<Result<Supplier>> {
    try {
        const response = await privateApi.post<Supplier>('/supplier', supplier);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao criar fornecedor",
        };
    }
}

export async function updateSupplier(supplierId: number, supplier: Supplier): Promise<Result<void>> {
    try {
        await privateApi.put(`/supplier/${supplierId}`, supplier);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao atualizar fornecedor",
        };
    }
}

export async function deleteSupplier(supplierId: number): Promise<Result<void>> {
    try {
        await privateApi.delete(`/supplier/${supplierId}`);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao deletar fornecedor",
        };
    }
}

export async function searchSuppliers(supermarketId: number, name: string): Promise<Result<Supplier[]>> {
    try {
        const response = await privateApi.get<Supplier[]>(`/supplier/supermarket/${supermarketId}/search`, {
            params: { name }
        });
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar fornecedores",
        };
    }
}
