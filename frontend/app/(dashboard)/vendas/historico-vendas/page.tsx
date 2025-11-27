"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Calendar, User, Package, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { useAuth } from "@/src/auth/AuthProvider";
import { Sale, getSalesBySupermarket, getSaleById } from "@/src/api/routes/sale";

export default function SalesHistoryPage() {
  const { supermarketData } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSale, setExpandedSale] = useState<number | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<number | null>(null);

  // Load sales on mount
  useEffect(() => {
    if (supermarketData?.idSupermercado) {
      loadSales();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supermarketData?.idSupermercado]);

  const loadSales = async () => {
    if (!supermarketData?.idSupermercado) return;
    
    setIsLoading(true);
    try {
      const result = await getSalesBySupermarket(supermarketData.idSupermercado);
      if (result.isSuccess && result.value) {
        setSales(result.value);
      } else {
        toast.error(result.error || "Erro ao carregar vendas");
      }
    } catch {
      toast.error("Erro ao carregar vendas");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter sales based on search
  const filteredSales = sales.filter(sale =>
    sale.idVenda.toString().includes(searchTerm.toLowerCase()) ||
    sale.cupomFiscalNumero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.itens?.some(item => item.nomeProduto?.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const toggleExpand = async (saleId: number) => {
    if (expandedSale === saleId) {
      setExpandedSale(null);
      return;
    }

    // If sale doesn't have items loaded, fetch them
    const sale = sales.find(s => s.idVenda === saleId);
    if (sale && !sale.itens) {
      setLoadingDetails(saleId);
      try {
        const result = await getSaleById(saleId);
        if (result.isSuccess && result.value) {
          setSales(prev => prev.map(s => 
            s.idVenda === saleId ? { ...s, itens: result.value?.itens } : s
          ));
        }
      } catch {
        toast.error("Erro ao carregar detalhes da venda");
      } finally {
        setLoadingDetails(null);
      }
    }
    
    setExpandedSale(saleId);
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
                  placeholder="Buscar por ID, cupom ou produto..."
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
                      <TableHead>Cupom Fiscal</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : filteredSales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          Nenhuma venda encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSales.map((sale) => (
                        <>
                          <TableRow
                            key={sale.idVenda}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => toggleExpand(sale.idVenda)}
                          >
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                {loadingDetails === sale.idVenda ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : expandedSale === sale.idVenda ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-mono text-xs">#{sale.idVenda}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDateTime(sale.dataHora)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {sale.idCliente ? `Cliente #${sale.idCliente}` : "Consumidor Final"}
                              </div>
                            </TableCell>
                            <TableCell>{sale.cupomFiscalNumero || "-"}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(sale.valorTotal)}
                            </TableCell>
                          </TableRow>
                          {expandedSale === sale.idVenda && (
                            <TableRow key={`${sale.idVenda}-details`}>
                              <TableCell colSpan={6} className="bg-muted/30">
                                <div className="p-4">
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Itens da Venda
                                  </h4>
                                  {sale.itens && sale.itens.length > 0 ? (
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
                                        {sale.itens.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.nomeProduto || `Produto #${item.idProduto}`}</TableCell>
                                            <TableCell className="text-right">{item.quantidade}</TableCell>
                                            <TableCell className="text-right">
                                              {formatCurrency(item.precoUnitario)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                              {formatCurrency(item.subtotal)}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  ) : (
                                    <p className="text-muted-foreground">Nenhum item encontrado.</p>
                                  )}
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
