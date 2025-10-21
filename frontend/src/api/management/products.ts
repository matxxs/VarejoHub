import { managementApi } from "../api"

export interface Result<T> {
    isSuccess: boolean
    value?: T
    error: string
}

export interface Product {
    idProduto?: number
    nome: string
    codigoBarras: string
    preco: number
    quantidadeEstoque: number
    estoqueMinimo: number
    categoria?: string
    descricao?: string
    idSupermercado: number
}

export async function getProductsBySupermarket(supermarketId: number): Promise<Result<Product[]>> {
    try {
        const response = await managementApi.get<Product[]>(`/product/supermarket/${supermarketId}/products`)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            error: error.response?.data?.message || "Erro ao buscar produtos",
        }
    }
}


export async function getProductById(productId: number) {
    try {
        const response = await managementApi.get<Product>(`/product/${productId}`)

        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            error: error.response?.data?.message || "Erro ao buscar produto por id",
        }
    }
}

export async function createProduct(product: Product): Promise<Result<Product>> {
    try {
        const response = await managementApi.post<Product>("/product", product)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            error: error.response?.data?.message || "Erro ao criar produto",
        }
    }
}

export async function updateProduct(productId: number, product: Product): Promise<Result<Product>> {
    try {
        const response = await managementApi.put<Product>(`/product/${productId}`, product)
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            error: error.response?.data?.message || "Erro ao criar produto",
        }
    }
}

export async function deleteProduct(productId: number) {
    try {
        const response = await managementApi.delete<void>(`/product/${productId}`)

        return {
            isSuccess: true,
            value: response.data,
            error: "",
        }
    } catch (error: any) {
        return {
            isSuccess: false,
            error: error.response?.data?.message || "Erro ao deletar o produto",
        }
    }
}


// export async function getAllSupermarkets(): Promise<Result<Supermarket[]>> {
//     try {
//         const response = await managementApi.get<Supermarket[]>("/supermarket")
//         return {
//             isSuccess: true,
//             value: response.data,
//             error: "",
//         }
//     } catch (error: any) {
//         return {
//             isSuccess: false,
//             error: error.response?.data?.message || "Erro ao buscar supermercados",
//         }
//     }
// }
