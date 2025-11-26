import { managementApi } from "../api";
import { Client, Result } from "@/src/types/entities";

export async function getClientsBySupermarket(supermarketId: number): Promise<Result<Client[]>> {
    try {
        const response = await managementApi.get<Client[]>(`/client/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar clientes",
        };
    }
}

export async function getClientById(clientId: number): Promise<Result<Client>> {
    try {
        const response = await managementApi.get<Client>(`/client/${clientId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar cliente",
        };
    }
}

export async function createClient(client: Omit<Client, 'idCliente'>): Promise<Result<Client>> {
    try {
        const response = await managementApi.post<Client>('/client', client);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao criar cliente",
        };
    }
}

export async function updateClient(clientId: number, client: Client): Promise<Result<void>> {
    try {
        await managementApi.put(`/client/${clientId}`, client);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao atualizar cliente",
        };
    }
}

export async function deleteClient(clientId: number): Promise<Result<void>> {
    try {
        await managementApi.delete(`/client/${clientId}`);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao deletar cliente",
        };
    }
}

export async function searchClients(supermarketId: number, name: string): Promise<Result<Client[]>> {
    try {
        const response = await managementApi.get<Client[]>(`/client/supermarket/${supermarketId}/search`, {
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
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar clientes",
        };
    }
}
