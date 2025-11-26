import { privateApi } from "../api";
import { FinancialTransaction, Result } from "@/src/types/entities";

export async function getFinancialTransactionsBySupermarket(supermarketId: number): Promise<Result<FinancialTransaction[]>> {
    try {
        const response = await privateApi.get<FinancialTransaction[]>(`/financialtransaction/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar transações financeiras",
        };
    }
}

export async function getFinancialTransactionById(transactionId: number): Promise<Result<FinancialTransaction>> {
    try {
        const response = await privateApi.get<FinancialTransaction>(`/financialtransaction/${transactionId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar transação financeira",
        };
    }
}

export async function createFinancialTransaction(transaction: Omit<FinancialTransaction, 'idTransacao'>): Promise<Result<FinancialTransaction>> {
    try {
        const response = await privateApi.post<FinancialTransaction>('/financialtransaction', transaction);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao criar transação financeira",
        };
    }
}

export async function updateFinancialTransaction(transactionId: number, transaction: FinancialTransaction): Promise<Result<void>> {
    try {
        await privateApi.put(`/financialtransaction/${transactionId}`, transaction);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao atualizar transação financeira",
        };
    }
}

export async function deleteFinancialTransaction(transactionId: number): Promise<Result<void>> {
    try {
        await privateApi.delete(`/financialtransaction/${transactionId}`);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao deletar transação financeira",
        };
    }
}

export async function getFinancialTransactionsByType(supermarketId: number, type: 'Receita' | 'Despesa'): Promise<Result<FinancialTransaction[]>> {
    try {
        const response = await privateApi.get<FinancialTransaction[]>(`/financialtransaction/supermarket/${supermarketId}/type/${type}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar transações financeiras por tipo",
        };
    }
}
