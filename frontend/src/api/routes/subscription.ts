import { privateApi } from "../api";
import { Subscription, Result } from "@/src/types/entities";

export async function getSubscriptionBySupermarket(supermarketId: number): Promise<Result<Subscription>> {
    try {
        const response = await privateApi.get<Subscription>(`/subscription/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar assinatura",
        };
    }
}

export async function getSubscriptionById(subscriptionId: number): Promise<Result<Subscription>> {
    try {
        const response = await privateApi.get<Subscription>(`/subscription/${subscriptionId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar assinatura",
        };
    }
}

export async function createSubscription(subscription: Omit<Subscription, 'idAssinatura'>): Promise<Result<Subscription>> {
    try {
        const response = await privateApi.post<Subscription>('/subscription', subscription);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao criar assinatura",
        };
    }
}

export async function updateSubscription(subscriptionId: number, subscription: Subscription): Promise<Result<void>> {
    try {
        await privateApi.put(`/subscription/${subscriptionId}`, subscription);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao atualizar assinatura",
        };
    }
}

export async function cancelSubscription(subscriptionId: number): Promise<Result<void>> {
    try {
        await privateApi.post(`/subscription/${subscriptionId}/cancel`);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao cancelar assinatura",
        };
    }
}
