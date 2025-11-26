import { privateApi } from "../api";
import { Invoice, Result } from "@/src/types/entities";

export async function getInvoicesBySupermarket(supermarketId: number): Promise<Result<Invoice[]>> {
    try {
        const response = await privateApi.get<Invoice[]>(`/invoice/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar faturas",
        };
    }
}

export async function getInvoiceById(invoiceId: number): Promise<Result<Invoice>> {
    try {
        const response = await privateApi.get<Invoice>(`/invoice/${invoiceId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar fatura",
        };
    }
}

export async function createInvoice(invoice: Omit<Invoice, 'idFatura'>): Promise<Result<Invoice>> {
    try {
        const response = await privateApi.post<Invoice>('/invoice', invoice);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao criar fatura",
        };
    }
}

export async function updateInvoice(invoiceId: number, invoice: Invoice): Promise<Result<void>> {
    try {
        await privateApi.put(`/invoice/${invoiceId}`, invoice);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao atualizar fatura",
        };
    }
}

export async function cancelInvoice(invoiceId: number): Promise<Result<void>> {
    try {
        await privateApi.post(`/invoice/${invoiceId}/cancel`);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao cancelar fatura",
        };
    }
}

export async function getInvoicesBySubscription(subscriptionId: number): Promise<Result<Invoice[]>> {
    try {
        const response = await privateApi.get<Invoice[]>(`/invoice/subscription/${subscriptionId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar faturas da assinatura",
        };
    }
}
