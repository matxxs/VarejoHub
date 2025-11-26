"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  // TODO: Buscar dados reais da API
  const metrics = {
    totalVendas: "R$ 45.231,89",
    totalProdutos: 1234,
    totalClientes: 567,
    margemLucro: "23.5%",
    produtosBaixoEstoque: 12,
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {/* TODO: Adicionar seletor de período (hoje, semana, mês) */}
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalVendas}</div>
            <p className="text-xs text-muted-foreground">
              {/* TODO: Adicionar comparação com mês anterior */}
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProdutos}</div>
            <p className="text-xs text-muted-foreground">
              {/* TODO: Adicionar variação */}
              +12 novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              {/* TODO: Adicionar clientes ativos */}
              +45 cadastrados este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Lucro</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.margemLucro}</div>
            <p className="text-xs text-muted-foreground">
              {/* TODO: Adicionar tendência */}
              +2.3% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Sales Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Implementar gráfico de vendas (ex: recharts) */}
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Gráfico de vendas será implementado aqui
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Produtos em Baixo Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: Buscar produtos reais com estoque baixo */}
              <div className="text-sm text-muted-foreground">
                {metrics.produtosBaixoEstoque} produtos precisam de reposição
              </div>
              <div className="space-y-2">
                {/* Placeholder items */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="text-sm font-medium">Produto {i}</p>
                      <p className="text-xs text-muted-foreground">
                        Estoque: {5 - i} unidades
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Implementar tabela de últimas transações */}
          <div className="text-sm text-muted-foreground">
            Lista de últimas transações será implementada aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
