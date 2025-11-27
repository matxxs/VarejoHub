"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Calendar, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSales } from "@/src/contexts/SalesContext";

export default function SalesHistoryPage() {
  const { sales } = useSales();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSale, setExpandedSale] = useState<string | null>(null);

  // Filter sales based on search
  const filteredSales = sales.filter(sale =>
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  const toggleExpand = (saleId: string) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="space-y-4 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground">
            Histórico de Vendas
          </h1>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, cliente ou produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredSales.length} venda(s) encontrada(s)
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Vendas Realizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Operador</TableHead>
                      <TableHead className="text-right">Itens</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                          Nenhuma venda encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSales.map((sale) => (
                        <>
                          <TableRow
                            key={sale.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => toggleExpand(sale.id)}
                          >
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                {expandedSale === sale.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{sale.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDateTime(sale.dateTime)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {sale.clientName || "Consumidor Final"}
                              </div>
                            </TableCell>
                            <TableCell>{sale.operatorName || "-"}</TableCell>
                            <TableCell className="text-right">{sale.items.length}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(sale.total)}
                            </TableCell>
                          </TableRow>
                          {expandedSale === sale.id && (
                            <TableRow key={`${sale.id}-details`}>
                              <TableCell colSpan={7} className="bg-muted/30">
                                <div className="p-4">
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Itens da Venda
                                  </h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Produto</TableHead>
                                        <TableHead className="text-right">Qtd</TableHead>
                                        <TableHead className="text-right">Preço Unit.</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {sale.items.map((item, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{item.productName}</TableCell>
                                          <TableCell className="text-right">{item.quantity}</TableCell>
                                          <TableCell className="text-right">
                                            {formatCurrency(item.unitPrice)}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {formatCurrency(item.subtotal)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
