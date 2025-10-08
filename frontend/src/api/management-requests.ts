import { managementApi } from './api';

// Exemplo: Requisição AUTENTICADA para a API-MANAGEMENT
export async function getSupermarketDetails(id: string) {
  // O cliente 'managementApi' já anexa o cabeçalho 'Authorization: Bearer {JWT}'
  // Rota: GET api/Supermarket/{id} (Exemplo)
  const response = await managementApi.get<any>(`/api/Supermarket/${id}`);
  return response.data;
}