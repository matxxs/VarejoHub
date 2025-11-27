"use client";

import { useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, X } from "lucide-react";
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
import { useData } from "@/src/contexts/DataContext";
import { useSales } from "@/src/contexts/SalesContext";
import { toast } from "sonner";

export default function PDVPage() {
  const { products, clients } = useData();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, checkout, cartTotal } = useSales();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toast.success(`${product.name} adicionado ao carrinho`);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Carrinho vazio! Adicione produtos antes de finalizar.");
      return;
    }
    setIsCheckoutDialogOpen(true);
  };

  const handleConfirmCheckout = () => {
    const clientId = selectedClient === "none" ? undefined : selectedClient || undefined;
    const sale = checkout(clientId, undefined);
    if (sale) {
      toast.success(`Venda finalizada! ID: ${sale.id} - Total: ${formatCurrency(sale.total)}`);
      setSelectedClient("");
      setIsCheckoutDialogOpen(false);
    } else {
      toast.error("Erro ao finalizar venda.");
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
                        {filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">
                              Nenhum produto encontrado.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(product.price)}
                              </TableCell>
                              <TableCell className="text-right">{product.stock}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  onClick={() => handleAddToCart(product.id)}
                                  disabled={product.stock <= 0}
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
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
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
            <Button onClick={handleConfirmCheckout}>
              Confirmar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
