import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Product, Result } from "@/src/types/entities";
import { privateApi } from "@/src/api/api";

// TODO: Importar funções de API quando forem criadas em src/api/routes/products.ts
// import { getProductsBySupermarket, createProduct, updateProduct, deleteProduct } from "@/src/api/routes/products";

// Funções temporárias de API - TODO: Substituir pelas funções reais
async function getProductsBySupermarket(
  supermarketId: number
): Promise<Result<Product[]>> {
  try {
    const response = await privateApi.get<Product[]>(
      `/product/supermarket/${supermarketId}`
    );
    return {
      isSuccess: true,
      value: response.data,
      error: "",
    };
  } catch (error: unknown) {
    return {
      isSuccess: false,
      error:
        error instanceof Error &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Erro ao buscar produtos",
    };
  }
}

async function createProduct(
  product: Omit<Product, "idProduto">
): Promise<Result<Product>> {
  try {
    const response = await privateApi.post<Product>("/product", product);
    return {
      isSuccess: true,
      value: response.data,
      error: "",
    };
  } catch (error: unknown) {
    return {
      isSuccess: false,
      error:
        error instanceof Error &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Erro ao criar produto",
    };
  }
}

/**
 * Hook para buscar produtos de um supermercado
 * @param supermarketId - ID do supermercado
 */
export function useProducts(supermarketId: number) {
  return useQuery({
    queryKey: ["products", supermarketId],
    queryFn: async () => {
      const result = await getProductsBySupermarket(supermarketId);
      if (!result.isSuccess) {
        throw new Error(result.error);
      }
      return result.value || [];
    },
    enabled: !!supermarketId,
  });
}

/**
 * Hook para criar um novo produto
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, "idProduto">) => {
      const result = await createProduct(product);
      if (!result.isSuccess) {
        throw new Error(result.error);
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar produto");
    },
  });
}

// TODO: Implementar hooks adicionais
// export function useUpdateProduct() { ... }
// export function useDeleteProduct() { ... }
// export function useProductById(productId: number) { ... }
