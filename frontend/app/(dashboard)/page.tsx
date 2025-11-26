"use client";

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
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Zap,
  HeadphonesIcon,
  Clock,
  Shield,
  BarChart3,
  Star,
} from "lucide-react";
import { User } from "@/src/api/routes/user";
import { useAuth } from "@/src/auth/AuthProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PricingTable from "@/components/pricing-table";

export default function IndexPage() {
  const { isAuthenticated, userData } = useAuth();

  return (
    <>
      <main className="min-h-screen">
        {isAuthenticated ? (
          <DashboardContent userData={userData!} />
        ) : (
          <MarketplaceContent />
        )}
      </main>
    </>
  );
}

function MarketplaceContent() {
  return (
    <>
      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden bg-background from-background via-background to-muted/20"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Gestão Inteligente na Nuvem
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance leading-[1.1] tracking-tight">
                Simplifique a gestão do seu supermercado
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground text-pretty leading-relaxed max-w-xl">
                Plataforma completa que unifica estoque, vendas, financeiro e
                fidelidade em tempo real.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <Button
                  size="lg"
                  className="text-base px-8 h-12 shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link href="/register">
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-12 bg-transparent"
                  asChild
                >
                  <Link href="#demo">Agendar Demonstração</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Sem cartão de crédito
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Teste grátis 14 dias
                  </span>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] h-[400px]">
              <div className="absolute inset-0 bg-background-to-tr from-primary/20 to-transparent rounded-3xl blur-3xl" />
              <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                <Image
                  src="/marketing/geladeiras-mercado.jpg"
                  alt="Interior moderno de supermercado"
                  width={1200}
                  height={1200}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Por que escolher o VarejoHub?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Transforme a gestão do seu supermercado com tecnologia de ponta
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  Decisões Baseadas em Dados
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Relatórios em tempo real com insights acionáveis para
                  maximizar seus lucros e reduzir desperdícios.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Segurança Garantida</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Seus dados protegidos com criptografia de ponta e backups
                  automáticos na nuvem.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Implementação Rápida</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Configure seu sistema em minutos, não em semanas. Comece a
                  vender no mesmo dia.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Economize Tempo</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Automatize tarefas repetitivas e foque no que realmente
                  importa: seus clientes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <HeadphonesIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Suporte Dedicado</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Equipe especializada pronta para ajudar você a qualquer
                  momento, em português.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  Atualizações Constantes
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Novas funcionalidades e melhorias adicionadas regularmente,
                  sem custo adicional.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modulos" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Módulos integrados para gerenciar cada aspecto do seu supermercado
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Estoque Module */}
            <Card className="border-2 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="/marketing/prateleiras-mercado.jpg"
                  alt="Controle de estoque"
                  width={1200}
                  height={1200}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 from-card/90 to-transparent" />
              </div>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Controle Inteligente de Estoque
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Receba alertas de baixa, rastreie entradas por NF e gerencie
                  perdas e vencimentos para garantir o giro ideal.
                </CardDescription>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Alertas automáticos de estoque baixo</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Controle de validade e perdas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Integração com notas fiscais</span>
                  </li>
                </ul>
              </CardHeader>
            </Card>

            {/* PDV Module */}
            <Card className="border-2 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="/marketing/pdv-mercado.jpg"
                  alt="Ponto de venda"
                  width={1200}
                  height={1200}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 from-card/90 to-transparent" />
              </div>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Ponto de Venda (PDV) Ágil
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  PDV moderno com integração total para leitores de código de
                  barras e balanças. Emissão de cupom fiscal rápida e sem erros.
                </CardDescription>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Interface intuitiva e rápida</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Múltiplas formas de pagamento</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Emissão de cupom fiscal eletrônico</span>
                  </li>
                </ul>
              </CardHeader>
            </Card>

            {/* Clientes Module */}
            <Card className="border-2 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="/marketing/pessoas-mercado.jpg"
                  alt="Fidelidade de clientes"
                  width={1200}
                  height={800}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 from-card/90 to-transparent" />
              </div>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Fidelidade e Personalização
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Construa relacionamentos duradouros. Cadastro de clientes,
                  ofertas exclusivas e programa de pontos automático para
                  aumentar o valor de cada compra.
                </CardDescription>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Programa de pontos e recompensas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Ofertas personalizadas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Histórico completo de compras</span>
                  </li>
                </ul>
              </CardHeader>
            </Card>

            {/* Financeiro Module */}
            <Card className="border-2 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="/marketing/dashboard-example.jpg"
                  alt="Gestão financeira"
                  width={1200}
                  height={1200}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background-to-t from-card/90 to-transparent" />
              </div>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Visão 360º das Finanças
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Domine seu Fluxo de Caixa diário. Controle contas a
                  pagar/receber e visualize relatórios de Margem de Lucro por
                  Produto para maximizar seus ganhos.
                </CardDescription>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Fluxo de caixa em tempo real</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Relatórios de margem por produto</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Contas a pagar e receber</span>
                  </li>
                </ul>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="precos" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <PricingTable />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32" id="faqs">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Perguntas Frequentes
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Tire suas dúvidas sobre o VarejoHub
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="border-2 rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Como funciona o período de teste gratuito?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  Você tem 14 dias para testar todas as funcionalidades do
                  VarejoHub sem compromisso. Não é necessário cartão de crédito
                  para começar. Após o período de teste, você pode escolher o
                  plano que melhor se adequa ao seu negócio.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border-2 rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Preciso instalar algum software?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  Não! O VarejoHub é 100% na nuvem. Você acessa de qualquer
                  dispositivo com internet, seja computador, tablet ou
                  smartphone. Basta fazer login e começar a usar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border-2 rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Meus dados estão seguros?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  Absolutamente. Utilizamos criptografia de ponta a ponta e
                  fazemos backups automáticos diários. Seus dados são
                  armazenados em servidores seguros com certificação
                  internacional. Você também pode exportar seus dados a qualquer
                  momento.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border-2 rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Posso integrar com meu equipamento atual?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  Sim! O VarejoHub é compatível com a maioria dos leitores de
                  código de barras, balanças e impressoras fiscais do mercado.
                  Nossa equipe de suporte ajuda você na configuração durante a
                  implementação.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="border-2 rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Qual é o suporte oferecido?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  Oferecemos suporte via chat, e-mail e telefone de segunda a
                  sábado. Também temos uma base de conhecimento completa com
                  tutoriais em vídeo e documentação detalhada. Para emergências,
                  temos suporte 24/7 disponível.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-6"
                className="border-2 rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Posso cancelar a qualquer momento?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  Sim, não há fidelidade. Você pode cancelar sua assinatura a
                  qualquer momento sem multas ou taxas adicionais. Seus dados
                  permanecerão disponíveis para exportação por 30 dias após o
                  cancelamento.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
          Olá, {userData?.nome}!
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
