"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Info, ArrowRight, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
// 1. Importar a função da API e a interface
import { getActivePlans, Plan as ApiPlan } from "@/src/api/management/plant"

// 2. Esta é a interface que o SEU COMPONENTE usa
type Feature = {
  text: string;
  included: boolean;
};

type Plan = {
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  billedYearlyText: string;
  discount?: string;
  isPopular?: boolean;
  buttonText: string;
  buttonColorClass: string;
  features: Feature[];
  additionalFeatures: Feature[];
};


function getPlanButtonClass(planName: string): string {
  switch (planName) {
    case "Free":
      return "bg-gray-900 hover:bg-gray-800 text-white";
    case "Básico":
      return "bg-blue-600 hover:bg-blue-700 text-white";
    case "Profissional":
      return "bg-purple-600 hover:bg-purple-700 text-white"; // Marcado como popular
    case "Premium":
      return "bg-yellow-500 hover:bg-yellow-600 text-black";
    default:
      return "bg-primary hover:bg-primary/90 text-primary-foreground";
  }
}

function transformApiPlans(apiPlans: ApiPlan[]): Plan[] {
  return apiPlans.map((apiPlan) => {
    const monthlyPrice = apiPlan.valorMensal;
    // Assumindo 2 meses grátis no plano anual (10x o valor mensal)
    // Ex: Básico 199.90 * 10 = 1999.00
    const yearlyPrice = monthlyPrice * 10;

    return {
      name: apiPlan.nomePlano,
      description: apiPlan.descricao || "Plano de acesso ao VarejoHub",
      priceMonthly: monthlyPrice,
      priceYearly: yearlyPrice,
      billedYearlyText: `Cobrado R$ ${yearlyPrice.toFixed(2).replace(".", ",")} /ano`,
      discount: monthlyPrice > 0 ? "Economize 2 meses" : undefined,
      isPopular: apiPlan.nomePlano === "Profissional", // Marcar 'Profissional' como popular
      buttonText: apiPlan.nomePlano === "Free" ? "Começar Grátis" : "Assinar Agora",
      buttonColorClass: getPlanButtonClass(apiPlan.nomePlano),
      // Mapeia limites
      features: [
        {
          text: `${apiPlan.limiteUsuarios === 999 ? 'Ilimitados' : apiPlan.limiteUsuarios} Usuários`,
          included: true
        },
        {
          text: `${apiPlan.limiteProdutos === 99999 ? 'Ilimitados' : apiPlan.limiteProdutos} Produtos`,
          included: true
        },
      ],
      additionalFeatures: [
        { text: "PDV (Ponto de Venda)", included: apiPlan.possuiPDV },
        { text: "Controle de Estoque", included: apiPlan.possuiControleEstoque },
        { text: "Módulo Financeiro", included: apiPlan.possuiFinanceiro },
        { text: "Fidelidade de Clientes", included: apiPlan.possuiFidelidade },
        { text: "Relatórios Avançados", included: apiPlan.possuiRelatoriosAvancados },
        { text: "Suporte Prioritário", included: apiPlan.possuiSuportePrioritario },
      ],
    };
  });
}

export default function PricingTable() {
  const [isYearly, setIsYearly] = useState(true);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        setIsLoading(true);
        const apiData = await getActivePlans();
        const transformedData = transformApiPlans(apiData);
        setPlans(transformedData);
        setError(null);
      } catch (err) {
        console.error("Falha ao buscar planos:", err);
        setError("Não foi possível carregar os planos. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlans();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl text-foreground">Nossos Planos</h1>
          <p className="text-muted-foreground text-lg text-balance">
            Escolha o plano ideal para seu supermercado. Cancele quando quiser.
          </p>
        </header>

        <div className="mb-12 text-center">
          <div className="bg-muted inline-flex items-center rounded-full p-1">
            <button
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                !isYearly ? "bg-background shadow-sm" : "text-muted-foreground"
              )}
              onClick={() => setIsYearly(false)}>
              Mensal
            </button>
            <button
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                isYearly ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              )}
              onClick={() => setIsYearly(true)}>
              Anual (Economize 2 meses)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "bg-background relative flex flex-col rounded-xl border p-6",
                plan.isPopular && "border-2 border-purple-600 shadow-xl"
              )}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                  Mais Popular
                </div>
              )}
              <h2 className="mb-2 text-2xl font-semibold">{plan.name}</h2>
              <p className="text-muted-foreground mb-4 text-sm h-10">{plan.description}</p>

              {plan.discount && isYearly && (
                <div
                  className={cn(
                    "absolute top-6 right-6 rounded-full px-2 py-1 text-xs font-semibold",
                    "bg-purple-100 text-purple-700"
                  )}>
                  {plan.discount}
                </div>
              )}

              {/* Lógica de Preço Atualizada */}
              <div className="mb-6 flex items-baseline">
                <span className="text-sm font-semibold">R$</span>
                <span className="text-5xl font-bold">
                  {(isYearly ? plan.priceYearly / 12 : plan.priceMonthly)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
                <span className="text-muted-foreground text-xl">/mês</span>
              </div>
              <p className="text-muted-foreground mb-6 text-sm">
                {plan.name === "Free"
                  ? "Para começar"
                  : isYearly
                    ? plan.billedYearlyText
                    : "Cobrado mensalmente"}
              </p>

              <Button className={cn("font-medium w-full", plan.buttonColorClass)}>
                {plan.buttonText} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-muted-foreground mt-4 mb-6 flex items-center justify-center text-xs">
                <Info className="mr-1 size-3" />
                <span>  
                  {plan.name === "Free" 
                    ? "Teste grátis por 14 dias"
                    : "Garantia de 7 dias"}
                </span>
              </div>

              <div className="flex-grow">
                <ul className="text-muted-foreground space-y-3 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {plan.additionalFeatures.length > 0 && (
                  <>
                    <h3 className="mt-6 mb-3 text-sm font-semibold text-foreground">Funcionalidades:</h3>
                    <ul className="text-muted-foreground space-y-3 text-left">
                      {plan.additionalFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          {feature.included ? (
                            <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                          ) : (
                            <XCircle className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                          )}
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <Button variant="ghost" className="text-muted-foreground hover:bg-muted mt-8 w-full">
                Comparar planos <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}