import { privateApi } from "../api";
import { Result } from "@/src/types/entities";

// Employee type mapped to User from backend
export interface Employee {
    idUsuario: number;
    idSupermercado: number;
    email: string;
    nome: string;
    nivelAcesso: 'Administrador' | 'Gerente' | 'Caixa' | 'Financeiro';
}

export async function getEmployeesBySupermarket(supermarketId: number): Promise<Result<Employee[]>> {
    try {
        const response = await privateApi.get<Employee[]>(`/user/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar funcionários",
        };
    }
}

export async function getEmployeeById(employeeId: number): Promise<Result<Employee>> {
    try {
        const response = await privateApi.get<Employee>(`/user/${employeeId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar funcionário",
        };
    }
}

export async function createEmployee(employee: Omit<Employee, 'idUsuario'>): Promise<Result<Employee>> {
    try {
        const response = await privateApi.post<Employee>('/user', employee);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao criar funcionário",
        };
    }
}

export async function updateEmployee(employeeId: number, employee: Employee): Promise<Result<void>> {
    try {
        await privateApi.put(`/user/${employeeId}`, employee);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao atualizar funcionário",
        };
    }
}

export async function deleteEmployee(employeeId: number): Promise<Result<void>> {
    try {
        await privateApi.delete(`/user/${employeeId}`);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao deletar funcionário",
        };
    }
}
