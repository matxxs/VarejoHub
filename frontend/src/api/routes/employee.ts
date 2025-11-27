import { isAxiosError } from "axios";
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

type ApiError = {
    message: string;
};

export async function getEmployeesBySupermarket(supermarketId: number): Promise<Result<Employee[]>> {
    try {
        const response = await privateApi.get<Employee[]>(`/user/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error) {
        const defaultError = "Erro ao buscar funcionários";
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message };
        }
        return { isSuccess: false, error: defaultError };
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
    } catch (error) {
        const defaultError = "Erro ao buscar funcionário";
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message };
        }
        return { isSuccess: false, error: defaultError };
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
    } catch (error) {
        const defaultError = "Erro ao criar funcionário";
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message };
        }
        return { isSuccess: false, error: defaultError };
    }
}

export async function updateEmployee(employeeId: number, employee: Employee): Promise<Result<void>> {
    try {
        await privateApi.put(`/user/${employeeId}`, employee);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error) {
        const defaultError = "Erro ao atualizar funcionário";
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message };
        }
        return { isSuccess: false, error: defaultError };
    }
}

export async function deleteEmployee(employeeId: number): Promise<Result<void>> {
    try {
        await privateApi.delete(`/user/${employeeId}`);
        return {
            isSuccess: true,
            error: "",
        };
    } catch (error) {
        const defaultError = "Erro ao deletar funcionário";
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message };
        }
        return { isSuccess: false, error: defaultError };
    }
}
