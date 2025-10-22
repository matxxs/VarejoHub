'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { User } from "@/src/api/management/user";
import { useAuth } from "@/src/auth/AuthProvider";

export default function IndexPage() {
  const { isAuthenticated, userData } = useAuth();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {isAuthenticated ? (
          <DashboardContent userData={userData!} />
        ) : (
          <MarketplaceContent />
        )}
      </main>

    </>

  )
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