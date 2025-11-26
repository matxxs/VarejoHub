// 1. Import the 'isAxiosError' type guard
import { isAxiosError } from "axios"
import { privateApi } from "../api"

export interface Result<T> {
    isSuccess: boolean
    value?: T
    error: string
}


export interface Product {
    idProduto?: number
    idSupermercado: number
    codigoBarras?: string    
    nome: string
    unidadeMedida: string  
    estoqueAtual: number       
    precoCusto?: number 
    precoVenda: number   
    alertaBaixoEstoque: number 
    dataCadastro?: string  
}
// ====================================================================

type ApiError = {
    message: string
}

export async function getProductsBySupermarket(supermarketId: number): Promise<Result<Product[]>> {
    try {
        const response = await privateApi.get<Product[]>(`/product/supermarket/${supermarketId}/products`)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error) {
        const defaultError = "Erro ao buscar produtos"
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message }
        }
        return { isSuccess: false, error: defaultError }
    }
}

export async function getProductById(productId: number): Promise<Result<Product>> {
    try {
        const response = await privateApi.get<Product>(`/product/${productId}`)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error) {
        const defaultError = "Erro ao buscar produto por id"
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message }
        }
        return { isSuccess: false, error: defaultError }
    }
}

export async function createProduct(product: Product): Promise<Result<Product>> {
    try {
        const response = await privateApi.post<Product>("/product", product)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error) {
        const defaultError = "Erro ao criar produto"
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message }
        }
        return { isSuccess: false, error: defaultError }
    }
}

export async function updateProduct(productId: number, product: Product): Promise<Result<Product>> {
    try {
        const response = await privateApi.put<Product>(`/product/${productId}`, product)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error) {
        const defaultError = "Erro ao atualizar produto"
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message }
        }
        return { isSuccess: false, error: defaultError }
    }
}

export async function deleteProduct(productId: number): Promise<Result<void>> {
    try {
        const response = await privateApi.delete<void>(`/product/${productId}`)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error) {
        const defaultError = "Erro ao deletar o produto"
        if (isAxiosError<ApiError>(error) && error.response?.data?.message) {
            return { isSuccess: false, error: error.response.data.message }
        }
        return { isSuccess: false, error: defaultError }
    }
}