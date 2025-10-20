import { managementApi, publicManagementApi } from '../api';

export interface Plan {
  idPlano: number;
  nomePlano: string;
  valorMensal: number;
  descricao?: string;  
  limiteUsuarios?: number;  
  limiteProdutos?: number; 
  eAtivo: boolean;

  possuiPDV: boolean;
  possuiControleEstoque: boolean;
  possuiFinanceiro: boolean;
  possuiFidelidade: boolean;
  possuiRelatoriosAvancados: boolean;
  possuiSuportePrioritario: boolean;
}


export async function getActivePlans(): Promise<Plan[]> {
  const response = await publicManagementApi.get<Plan[]>(`/plan/active`);
  return response.data;
}