"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
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
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";

// Define the Product interface based on your backend structure
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    barcode: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        category: "",
        barcode: "",
    });

    // Fetch products on mount
    //   useEffect(() => {
    //     fetchProducts();
    //   }, []);

    //   const fetchProducts = async () => {
    //     try {
    //       // Replace with your actual API call
    //       // const response = await api.get('/products');
    //       // setProducts(response.data);

    //       // Mock data for demonstration
    //       setTimeout(() => {
    //         setProducts([
    //           { id: "1", name: "Arroz 5kg", price: 25.90, stock: 100, category: "Alimentos", barcode: "789123456" },
    //           { id: "2", name: "Feijão 1kg", price: 8.50, stock: 50, category: "Alimentos", barcode: "789654321" },
    //           { id: "3", name: "Detergente", price: 2.99, stock: 200, category: "Limpeza", barcode: "123456789" },
    //         ]);
    //         setIsLoading(false);
    //       }, 500);
    //     } catch (error) {
    //       toast({
    //         title: "Erro",
    //         description: "Não foi possível carregar os produtos.",
    //         variant: "destructive",
    //       });
    //       setIsLoading(false);
    //     }
    //   };

    //   const handleSave = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     try {
    //       const productData = {
    //         ...formData,
    //         price: Number(formData.price),
    //         stock: Number(formData.stock),
    //       };

    //       if (currentProduct) {
    //         // Update existing product
    //         // await api.put(`/products/${currentProduct.id}`, productData);
    //         setProducts(products.map(p => p.id === currentProduct.id ? { ...productData, id: p.id } : p));
    //         toast({ title: "Sucesso", description: "Produto atualizado com sucesso!" });
    //       } else {
    //         // Create new product
    //         // const response = await api.post('/products', productData);
    //         const newProduct = { ...productData, id: Math.random().toString() };
    //         setProducts([...products, newProduct]);
    //         toast({ title: "Sucesso", description: "Produto cadastrado com sucesso!" });
    //       }

    //       closeDialog();
    //     } catch (error) {
    //       toast({
    //         title: "Erro",
    //         description: "Erro ao salvar o produto.",
    //         variant: "destructive",
    //       });
    //     }
    //   };

    //   const handleDelete = async (id: string) => {
    //     if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    //     try {
    //       // await api.delete(`/products/${id}`);
    //       setProducts(products.filter(p => p.id !== id));
    //       toast({ title: "Sucesso", description: "Produto removido com sucesso!" });
    //     } catch (error) {
    //       toast({
    //         title: "Erro",
    //         description: "Erro ao excluir o produto.",
    //         variant: "destructive",
    //       });
    //     }
    //   };

    const openEditDialog = (product: Product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category,
            barcode: product.barcode,
        });
        setIsDialogOpen(true);
    };

    const openNewDialog = () => {
        setCurrentProduct(null);
        setFormData({
            name: "",
            price: "",
            stock: "",
            category: "",
            barcode: "",
        });
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setCurrentProduct(null);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
    );

    return (
        <main className="min-h-screen">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="space-y-4 max-w-4xl">
                    <h1 className="text-4xl font-bold text-foreground">
                        Produtos
                    </h1>
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome ou código de barras..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button onClick={openNewDialog}>
                            <Plus className="mr-2 h-4 w-4" /> Novo Produto
                        </Button>
                    </div>

                    {/* Adicione os componentes reais do seu dashboard aqui */}
                    <div className="pt-8">


                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Código de Barras</TableHead>
                                    <TableHead className="text-right">Preço</TableHead>
                                    <TableHead className="text-right">Estoque</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">Carregando...</TableCell>
                                    </TableRow>
                                ) : filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">Nenhum produto encontrado.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>{product.barcode}</TableCell>
                                            <TableCell className="text-right">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                            </TableCell>
                                            <TableCell className="text-right">{product.stock}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>{currentProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                                </DialogHeader>
                                <form className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Nome</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="category" className="text-right">Categoria</Label>
                                        <Input
                                            id="category"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="barcode" className="text-right">Cód. Barras</Label>
                                        <Input
                                            id="barcode"
                                            value={formData.barcode}
                                            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="price" className="text-right">Preço</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="stock" className="text-right">Estoque</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
                                        <Button type="submit">Salvar</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </main>
    );
}