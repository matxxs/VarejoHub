"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { useAuth } from "@/src/auth/AuthProvider"

export default function IndexPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">VarejoHub</span>
          </div>
          <>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#modulos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Módulos
              </Link>
              <Link href="#recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </Link>
              <Link href="#precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Começar Grátis</Link>
                  </Button>
                </>
              )}
            </div>
          </>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
              VarejoHub: A Gestão de Supermercado Simples, Completa e na Nuvem
            </h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Centralize Estoque, PDV, Financeiro e Fidelidade em uma única plataforma. Elimine perdas, otimize vendas e
              tome decisões com dados em tempo real.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/register">Começar Agora</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
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
                <Image src="/supermarket-warehouse-inventory-shelves-with-organ.jpg" alt="Controle de estoque" fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Controle Inteligente de Estoque</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Receba alertas de baixa, rastreie entradas por NF e gerencie perdas e vencimentos para garantir o giro
                  ideal.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* PDV Module */}
            <Card className="border-2 hover:border-secondary/50 transition-colors overflow-hidden py-0 pb-6">
              <div className="relative h-48 w-full">
                <Image src="/modern-supermarket-checkout-counter-with-pos-syste.jpg" alt="Ponto de venda" fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Ponto de Venda (PDV) Ágil</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  PDV moderno com integração total para leitores de código de barras e balanças. Emissão de cupom fiscal
                  rápida e sem erros.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Clientes Module */}
            <Card className="border-2 hover:border-accent/50 transition-colors overflow-hidden py-0 pb-6">
              <div className="relative h-48 w-full">
                <Image src="/happy-customers-shopping-in-supermarket-with-shopp.jpg" alt="Fidelidade de clientes" fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">Fidelidade e Personalização</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Construa relacionamentos duradouros. Cadastro de clientes, ofertas exclusivas e programa de pontos
                  automático para aumentar o valor de cada compra.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Financeiro Module */}
            <Card className="border-2 hover:border-chart-4/50 transition-colors overflow-hidden py-0 pb-6">
              <div className="relative h-48 w-full">
                <Image src="/financial-dashboard-with-charts-and-analytics-for-.jpg" alt="Gestão financeira" fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-chart-4" />
                </div>
                <CardTitle className="text-2xl">Visão 360º das Finanças</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Domine seu Fluxo de Caixa diário. Controle contas a pagar/receber e visualize relatórios de Margem de
                  Lucro por Produto para maximizar seus ganhos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/supermarket-team-working-together-professional-ret.jpg" alt="Equipe VarejoHub" fill className="object-cover opacity-10" />
          </div>
          <div className="relative z-10 text-center bg-primary/5 rounded-2xl p-12 border border-primary/20 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Pronto para transformar sua gestão?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Junte-se a centenas de supermercados que já otimizaram suas operações com o VarejoHub
            </p>
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/register">Começar Gratuitamente</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">V</span>
              </div>
              <span className="text-sm text-muted-foreground">© 2025 VarejoHub. Todos os direitos reservados.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Suporte
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
