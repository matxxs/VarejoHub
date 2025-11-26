import { publicApi } from '../api';

export interface PlanSummary {
  nomePlano: string;
  statusAssinatura: string;
}

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
  const response = await publicApi.get<Plan[]>(`/plan/active`);
  return response.data;
}