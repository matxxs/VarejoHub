"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, X, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/src/auth/AuthProvider";
import { Product, getProductsBySupermarket } from "@/src/api/routes/products";
import { Client, getClientsBySupermarket } from "@/src/api/routes/client";
import { Sale, SaleItem, createSale } from "@/src/api/routes/sale";

// Cart item for local state
interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export default function PDVPage() {
  const { supermarketData, userData } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Load products and clients on mount
  useEffect(() => {
    if (supermarketData?.idSupermercado) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supermarketData?.idSupermercado]);

  const loadData = async () => {
    if (!supermarketData?.idSupermercado) return;
    
    setIsLoading(true);
    try {
      const [productsResult, clientsResult] = await Promise.all([
        getProductsBySupermarket(supermarketData.idSupermercado),
        getClientsBySupermarket(supermarketData.idSupermercado)
      ]);
      
      if (productsResult.isSuccess && productsResult.value) {
        setProducts(productsResult.value);
      } else {
        toast.error(productsResult.error || "Erro ao carregar produtos");
      }
      
      if (clientsResult.isSuccess && clientsResult.value) {
        setClients(clientsResult.value);
      }
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigoBarras?.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    if (!product.idProduto) return;
    
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.idProduto);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * updated[existingIndex].unitPrice,
        };
        return updated;
      }
      
      const newItem: CartItem = {
        productId: product.idProduto,
        productName: product.nome,
        quantity: 1,
        unitPrice: product.preco,
        subtotal: product.preco,
      };
      return [...prev, newItem];
    });
    
    toast.success(`${product.nome} adicionado ao carrinho`);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.productId !== productId));
      return;
    }
    
    setCart(prev => {
      const index = prev.findIndex(item => item.productId === productId);
      if (index === -1) return prev;
      
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity,
        subtotal: quantity * updated[index].unitPrice,
      };
      return updated;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Carrinho vazio! Adicione produtos antes de finalizar.");
      return;
    }
    setIsCheckoutDialogOpen(true);
  };

  const handleConfirmCheckout = async () => {
    if (!supermarketData?.idSupermercado) {
      toast.error("Erro: supermercado não identificado");
      return;
    }

    setIsCheckingOut(true);

    const clientId = selectedClient && selectedClient !== "none" ? parseInt(selectedClient) : undefined;

    const saleData: Omit<Sale, 'idVenda'> = {
      idSupermercado: supermarketData.idSupermercado,
      idUsuarioCaixa: userData?.idUsuario,
      idCliente: clientId,
      dataHora: new Date().toISOString(),
      valorTotal: cartTotal,
      itens: cart.map(item => ({
        idItemVenda: 0,
        idVenda: 0,
        idProduto: item.productId,
        quantidade: item.quantity,
        precoUnitario: item.unitPrice,
        subtotal: item.subtotal,
        nomeProduto: item.productName,
      } as SaleItem)),
    };

    try {
      const result = await createSale(saleData);
      if (result.isSuccess && result.value) {
        toast.success(`Venda finalizada! ID: ${result.value.idVenda} - Total: ${formatCurrency(cartTotal)}`);
        setSelectedClient("");
        setIsCheckoutDialogOpen(false);
        setCart([]);
        loadData(); // Reload products to update stock
      } else {
        toast.error(result.error || "Erro ao finalizar venda");
      }
    } catch {
      toast.error("Erro ao finalizar venda");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="space-y-4 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground">
            Ponto de Venda (PDV)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Products Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou código de barras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Produtos Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead className="text-right">Preço</TableHead>
                          <TableHead className="text-right">Estoque</TableHead>
                          <TableHead className="text-right">Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">
                              Nenhum produto encontrado.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map((product) => (
                            <TableRow key={product.idProduto}>
                              <TableCell className="font-medium">{product.nome}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(product.preco)}
                              </TableCell>
                              <TableCell className="text-right">{product.quantidadeEstoque}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(product)}
                                  disabled={product.quantidadeEstoque <= 0}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Adicionar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart Section */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Carrinho
                  </CardTitle>
                  {cart.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearCart}>
                      <X className="h-4 w-4 mr-1" />
                      Limpar
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] overflow-y-auto space-y-3">
                    {cart.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Carrinho vazio
                      </p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between border-b pb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(item.unitPrice)} x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold">{formatCurrency(cartTotal)}</span>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleCheckout} disabled={cart.length === 0}>
                      Finalizar Venda
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente (opcional)</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Consumidor Final</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.idCliente} value={client.idCliente.toString()}>
                      {client.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resumo</Label>
              <div className="bg-muted p-3 rounded-md space-y-1">
                <p className="text-sm">Itens: {cart.length}</p>
                <p className="text-sm">Quantidade total: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p className="text-lg font-bold">Total: {formatCurrency(cartTotal)}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmCheckout} disabled={isCheckingOut}>
              {isCheckingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
