"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Shield,
  Settings,
  LogOut,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Building,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/auth/AuthProvider";
import { getActivePlans, Plan as ApiPlan } from "@/src/api/routes/plant";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  items: {
    title: string;
    href: string;
  }[];
}

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
    const yearlyPrice = monthlyPrice * 10;

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

// --- Componente Navbar ---
export function Navbar() {
  // --- Hooks de Autenticação e Estado ---
  const { isAuthenticated, userData, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 2. OBTER O PATHNAME
  const pathname = usePathname();

  // --- Definição do Menu Marketplace (Não Autenticado) ---
  const marketplaceNavItems = [
    { title: "Início", href: "#home" },
    { title: "Benefícios", href: "#beneficios" },
    { title: "Módulos", href: "#modulos" },
    { title: "Preços", href: "#precos" },
    { title: "FAQs", href: "#faqs" },
  ];

  const plan = userData?.supermercado?.plano.nomePlano;
  const isFree = plan === "Free";

  // --- Hooks de API (Planos) ---
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [errorPlans, setErrorPlans] = useState<string | null>(null);

  useEffect(() => {
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
      setIsLoadingPlans(false);
    }
  }, [isAuthenticated, isFree]);

  const upgradePlans = plans.filter((p) => p.name !== "Free");

  const navigationItems: NavItem[] = useMemo(() => {
    if (!userData) return [];

    const items: NavItem[] = [];
    const nivel = userData.nivelAcesso;
    const isGlobal = userData.eGlobalAdmin;

    if (nivel === "Caixa" || nivel === "Gerente" || nivel === "Administrador") {
      items.push({
        label: "Vendas",
        icon: <ShoppingCart className="h-4 w-4" />,
        items: [
          { title: "Ponto de Venda (PDV)", href: "/vendas/pdv" },
          { title: "Histórico de Vendas", href: "/vendas/historico" },
        ],
      });
    }

    if (nivel === "Gerente" || nivel === "Administrador") {
      items.push({
        label: "Cadastros",
        icon: <Package className="h-4 w-4" />,
        items: [
          { title: "Cadastrar Produtos", href: "/cadastros/produtos" },
          { title: "Cadastrar Categorias", href: "/cadastros/categorias" },
          { title: "Cadastrar Fornecedores", href: "/cadastros/fornecedores" },
        ],
      });
    }

    if (nivel === "Financeiro" || nivel === "Administrador") {
      items.push({
        label: "Financeiro",
        icon: <DollarSign className="h-4 w-4" />,
        items: [
          { title: "Contas a Pagar", href: "/financeiro/pagar" },
          { title: "Contas a Receber", href: "/financeiro/receber" },
          { title: "Fluxo de Caixa", href: "/financeiro/fluxo" },
        ],
      });
    }

    if (nivel === "Administrador") {
      items.push({
        label: "Gestão",
        icon: <Users className="h-4 w-4" />,
        items: [
          { title: "Gerenciar Usuários", href: "/gestao/usuarios" },
          {
            title: "Configurações do Mercado",
            href: "/gestao/configuracoes",
          },
        ],
      });
    }

    if (isGlobal) {
      items.push({
        label: "Admin Global",
        icon: <Shield className="h-4 w-4" />,
        items: [
          { title: "Gerenciar Supermercados", href: "/global/supermercados" },
          { title: "Gerenciar Planos", href: "/global/planos" },
        ],
      });
    }

    return items;
  }, [userData]);

  // --- Lógica de Dropdown - Sem alteração ---
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = (label: string) => {
    clearCloseTimeout();
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, []);

  const handleLogoutClick = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <>
      <nav className="border-b border-border bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo (Link para a página inicial) */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                V
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">VarejoHub</span>
          </Link>

          {/* Navegação Central (Dinâmica) */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            {/* Menu do Sistema (Autenticado) */}
            {isAuthenticated && navigationItems.length > 0 && (
              <div className="flex items-center gap-1">
                {navigationItems.map((item) => {
                  const baseGroupPath = item.items[0]?.href.split("/")[1];
                  const currentBasePath = pathname.split("/")[1];
                  const isActive =
                    baseGroupPath && baseGroupPath === currentBasePath;

                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={cn(
                          "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer", // ADICIONADO cursor-pointer
                          activeDropdown === item.label
                            ? "text-foreground bg-foreground/10" // Estado de hover/dropdown
                            : isActive
                            ? "text-primary hover:text-primary" // Estado ATIVO (página atual)
                            : "text-muted-foreground hover:text-foreground" // Estado padrão
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Menu do Marketplace (Não Autenticado) */}
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                {marketplaceNavItems.map((item) => {
                  // 3. LÓGICA isActive (Menu Marketplace)
                  const isActive = pathname === item.href;
                  return (
                    <Button key={item.title} variant="ghost" asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-foreground cursor-pointer", // ADICIONADO cursor-pointer
                          isActive
                            ? "text-primary" // Estado ATIVO
                            : "text-muted-foreground" // Estado padrão
                        )}
                      >
                        {item.title}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ações do Lado Direito */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Botão de Planos (Upgrade) */}
                {isFree && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="cursor-pointer">Update</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
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
                            className={cn(
                              "flex w-full h-auto p-1 space-x-1 justify-center max-w-full"
                            )}
                          >
                            {upgradePlans.map((plan) => (
                              <TabsTrigger
                                key={plan.name}
                                value={plan.name}
                                className="truncate flex-1"
                              >
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
                                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
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
                                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                          ) : (
                                            <XCircle className="mr-2 h-4 w-4 text-gray-400" />
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
                {/* Menu do Usuário */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full cursor-pointer"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src="/placeholder.svg?height=36&width=36"
                          alt="User"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userData?.nome
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userData?.nome}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userData?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Minha Conta</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Atualizar Plano</span>
                    </DropdownMenuItem>
                    {userData?.nivelAcesso === "Administrador" && (
                      <DropdownMenuItem className="cursor-pointer">
                        <Building className="mr-2 h-4 w-4" />
                        <span>Meu Supermercado</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogoutClick}
                      disabled={isLoggingOut}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <span>
                        {isLoggingOut ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="mr-2 h-4 w-4" />
                        )}
                      </span>
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="cursor-pointer">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="cursor-pointer">
                  <Link href="/register">Registrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Dropdown (Mega Menu) */}
      {activeDropdown && (
        <div
          className="fixed left-0 right-0 top-16 z-40 border-b border-border bg-foreground/20 backdrop-blur animate-in fade-in slide-in-from-top-2"
          onMouseEnter={clearCloseTimeout}
          onMouseLeave={handleMouseLeave}
        >
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {navigationItems
                .find((item) => item.label === activeDropdown)
                ?.items.map((subItem) => {
                  const isActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className={cn(
                        "rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-background/80 cursor-pointer", // ADICIONADO cursor-pointer
                        isActive ? "text-primary font-bold" : "text-foreground"
                      )}
                    >
                      {subItem.title}
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
