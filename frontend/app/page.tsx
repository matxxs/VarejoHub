"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// --- Imports de Componentes (shadcn/ui) ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Imports para o novo menu de usuário
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Imports de Ícones ---
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
  User as UserIcon, // Ícone de usuário para o menu
  LogOut, // Ícone de logout
} from "lucide-react";

// --- Imports de Lógica de Negócio (Auth e API) ---
import { useAuth } from "@/src/auth/AuthProvider";
import { User } from "@/src/api/management/user"; // Importando a interface User
import { getActivePlans, Plan as ApiPlan } from "@/src/api/management/plant";
import { cn } from "@/lib/utils";
import { Navbar } from "../components/navbar";

// --- LÓGICA DE DADOS (Movida do PricingTable) ---
// (As interfaces e funções 'transformApiPlans' e 'getPlanButtonClass' continuam aqui)

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
  // Esta função não é usada no modal, mas é mantida por completude
  switch (planName) {
    case "Free":
      return "bg-gray-900 hover:bg-gray-800 text-white";
    case "Básico":
      return "bg-blue-600 hover:bg-blue-700 text-white";
    case "Profissional":
      return "bg-purple-600 hover:bg-purple-700 text-white";
    case "Premium":
      return "bg-yellow-500 hover:bg-yellow-600 text-black";
    default:
      return "bg-primary hover:bg-primary/90 text-primary-foreground";
  }
}

function transformApiPlans(apiPlans: ApiPlan[]): Plan[] {
  return apiPlans.map((apiPlan) => {
    const monthlyPrice = apiPlan.valorMensal;
    const yearlyPrice = monthlyPrice * 10; // 10x para 2 meses de desconto

    return {
      name: apiPlan.nomePlano,
      description: apiPlan.descricao || "Plano de acesso ao VarejoHub",
      priceMonthly: monthlyPrice,
      priceYearly: yearlyPrice,
      billedYearlyText: `Cobrado R$ ${yearlyPrice
        .toFixed(2)
        .replace(".", ",")} /ano`,
      discount: monthlyPrice > 0 ? "Economize 2 meses" : undefined,
      isPopular: apiPlan.nomePlano === "Profissional",
      buttonText:
        apiPlan.nomePlano === "Free" ? "Começar Grátis" : "Assinar Agora",
      buttonColorClass: getPlanButtonClass(apiPlan.nomePlano),
      features: [
        {
          text: `${
            apiPlan.limiteUsuarios === 999
              ? "Ilimitados"
              : apiPlan.limiteUsuarios
          } Usuários`,
          included: true,
        },
        {
          text: `${
            apiPlan.limiteProdutos === 99999
              ? "Ilimitados"
              : apiPlan.limiteProdutos
          } Produtos`,
          included: true,
        },
      ],
      additionalFeatures: [
        { text: "PDV (Ponto de Venda)", included: apiPlan.possuiPDV },
        {
          text: "Controle de Estoque",
          included: apiPlan.possuiControleEstoque,
        },
        { text: "Módulo Financeiro", included: apiPlan.possuiFinanceiro },
        { text: "Fidelidade de Clientes", included: apiPlan.possuiFidelidade },
        {
          text: "Relatórios Avançados",
          included: apiPlan.possuiRelatoriosAvancados,
        },
        {
          text: "Suporte Prioritário",
          included: apiPlan.possuiSuportePrioritario,
        },
      ],
    };
  });
}

// --- FIM DA LÓGICA DE DADOS ---

// --- COMPONENTE PRINCIPAL ---

export default function IndexPage() {
  // --- Hooks de Autenticação e Estado ---
  const { isAuthenticated, userData, isAuthLoaded, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const plan = userData?.supermercado?.plano.nomePlano;
  const isFree = plan === "Free";

  // --- Hooks de API (Planos) ---
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [errorPlans, setErrorPlans] = useState<string | null>(null);

  useEffect(() => {
    // Só busca os planos se o usuário não estiver logado
    // ou se estiver logado e for 'Free' (para o modal de upgrade)
    if (!isAuthenticated || (isAuthenticated && isFree)) {
      async function fetchPlans() {
        try {
          setIsLoadingPlans(true);
          const apiData = await getActivePlans();
          const transformedData = transformApiPlans(apiData);
          setPlans(transformedData);
          setErrorPlans(null);
        } catch (err) {
          console.error("Falha ao buscar planos:", err);
          setErrorPlans("Não foi possível carregar os planos.");
        } finally {
          setIsLoadingPlans(false);
        }
      }
      fetchPlans();
    } else {
      setIsLoadingPlans(false); // Se logado e não for 'Free', não precisa carregar planos
    }
  }, [isAuthenticated, isFree]); // Depende do status de autenticação

  const upgradePlans = plans.filter((p) => p.name !== "Free");

  // --- Handlers ---
  const handleLogoutClick = () => {
    setIsLoggingOut(true);

    // Dá 100ms para o React renderizar o spinner antes de mudar o contexto
    setTimeout(() => {
      logout();
      // Você nem precisa mais do setIsLoggingOut(false),
      // pois o componente será destruído.
    }, 100);
  };

  if (!isAuthLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* --- HEADER --- */}
      <header className="border-b border-border bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                V
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">VarejoHub</span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isFree && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Atualizar</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Faça o Upgrade do VarejoHub</DialogTitle>
                        <DialogDescription>
                          Escolha o plano que melhor se adapta ao seu negócio.
                        </DialogDescription>
                      </DialogHeader>

                      {isLoadingPlans ? (
                        <div className="flex justify-center items-center h-64">
                          <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                      ) : errorPlans ? (
                        <div className="flex justify-center items-center h-64">
                          <p className="text-red-600 text-center px-4">
                            {errorPlans}
                          </p>
                        </div>
                      ) : (
                        <Tabs
                          defaultValue="Profissional"
                          className="w-full pt-2"
                        >
                          <TabsList
                            className={`grid w-full grid-cols-${upgradePlans.length}`}
                          >
                            {upgradePlans.map((plan) => (
                              <TabsTrigger key={plan.name} value={plan.name}>
                                {plan.name}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {upgradePlans.map((plan) => (
                            <TabsContent key={plan.name} value={plan.name}>
                              <Card
                                className={cn(
                                  plan.isPopular && "border-primary shadow-lg"
                                )}
                              >
                                <CardHeader>
                                  <CardTitle>{plan.name}</CardTitle>
                                  <CardDescription>
                                    A partir de R${" "}
                                    {(plan.priceYearly / 12)
                                      .toFixed(2)
                                      .replace(".", ",")}{" "}
                                    /mês*
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm max-h-60 overflow-y-auto pr-3">
                                  <ul className="space-y-2">
                                    {plan.features.map((feature, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-center"
                                      >
                                        <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                                        {feature.text}
                                      </li>
                                    ))}
                                  </ul>
                                  <h3 className="text-sm font-semibold text-foreground border-t pt-3">
                                    Funcionalidades:
                                  </h3>
                                  <ul className="space-y-2">
                                    {plan.additionalFeatures.map(
                                      (feature, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-center"
                                        >
                                          {feature.included ? (
                                            <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                                          ) : (
                                            <XCircle className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                          )}
                                          {feature.text}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                  <p className="text-xs text-muted-foreground pt-2">
                                    *Valor no plano anual
                                  </p>
                                </CardContent>
                              </Card>
                            </TabsContent>
                          ))}
                        </Tabs>
                      )}

                      <DialogFooter>
                        <Button asChild className="w-full" size="lg">
                          <Link href="/pricing">
                            Ver detalhes completos e Assinar
                          </Link>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span className="sr-only">Abrir menu do usuário</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{userData?.nome}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Configurações</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogoutClick}
                      disabled={isLoggingOut}
                      className="text-red-600"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="#modulos"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Módulos
                  </Link>
                  <Link
                    href="#recursos"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Recursos
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Preços
                  </Link>
                </nav>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Registrar</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {isAuthenticated ? (
          <DashboardContent userData={userData!} />
        ) : (
          <MarketplaceContent />
        )}
      </main>
    </div>
  );
}

function MarketplaceContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
              VarejoHub: A Gestão de Supermercado Simples, Completa e na Nuvem
            </h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Centralize Estoque, PDV, Financeiro e Fidelidade em uma única
              plataforma. Elimine perdas, otimize vendas e tome decisões com
              dados em tempo real.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/register">Começar Agora</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 bg-transparent"
              >
                Agendar Demo
              </Button>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/modern-supermarket-interior-with-organized-shelves.jpg"
              alt="Interior moderno de supermercado"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modulos" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Módulos integrados para gerenciar cada aspecto do seu supermercado
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Estoque Module */}
            <Card className="border-2 hover:border-primary/50 transition-colors overflow-hidden py-0 pb-6">
              <div className="relative h-48 w-full">
                <Image
                  src="/supermarket-warehouse-inventory-shelves-with-organ.jpg"
                  alt="Controle de estoque"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Controle Inteligente de Estoque
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Receba alertas de baixa, rastreie entradas por NF e gerencie
                  perdas e vencimentos para garantir o giro ideal.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* PDV Module */}
            <Card className="border-2 hover:border-secondary/50 transition-colors overflow-hidden py-0 pb-6">
              <div className="relative h-48 w-full">
                <Image
                  src="/modern-supermarket-checkout-counter-with-pos-syste.jpg"
                  alt="Ponto de venda"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">
                  Ponto de Venda (PDV) Ágil
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  PDV moderno com integração total para leitores de código de
                  barras e balanças. Emissão de cupom fiscal rápida e sem erros.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Clientes Module */}
            <Card className="border-2 hover:border-accent/50 transition-colors overflow-hidden py-0 pb-6">
              <div className="relative h-48 w-full">
                <Image
                  src="/happy-customers-shopping-in-supermarket-with-shopp.jpg"
                  alt="Fidelidade de clientes"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">
                  Fidelidade e Personalização
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Construa relacionamentos duradouros. Cadastro de clientes,
                  ofertas exclusivas e programa de pontos automático para
                  aumentar o valor de cada compra.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Financeiro Module */}
            <Card className="border-2 hover:border-chart-4/50 transition-colors overflow-hidden py-0 pb-6">
              <div className="relative h-48 w-full">
                <Image
                  src="/financial-dashboard-with-charts-and-analytics-for-.jpg"
                  alt="Gestão financeira"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-chart-4" />
                </div>
                <CardTitle className="text-2xl">
                  Visão 360º das Finanças
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Domine seu Fluxo de Caixa diário. Controle contas a
                  pagar/receber e visualize relatórios de Margem de Lucro por
                  Produto para maximizar seus ganhos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  V
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                © 2025 VarejoHub. Todos os direitos reservados.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Suporte
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Termos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function DashboardContent({ userData }: { userData: User }) {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="space-y-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground">
          Olá, {userData.nome}!
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Bem-vindo ao seu dashboard VarejoHub. Aqui você pode gerenciar seu
          supermercado, ver relatórios e muito mais.
        </p>

        {/* Adicione os componentes reais do seu dashboard aqui */}
        <div className="pt-8">
          <h2 className="text-2xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Ver Vendas</CardTitle>
                <CardDescription>
                  Acompanhe suas vendas em tempo real.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/dashboard/vendas">Ir para Vendas</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Estoque</CardTitle>
                <CardDescription>
                  Adicione produtos e controle o estoque.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/dashboard/estoque">Ir para Estoque</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Módulo Financeiro</CardTitle>
                <CardDescription>
                  Veja seu fluxo de caixa e relatórios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/dashboard/financeiro">Ir para Financeiro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
