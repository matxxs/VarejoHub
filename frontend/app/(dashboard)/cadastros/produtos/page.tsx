"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/src/auth/AuthProvider";
import { Product as ApiProduct, getProductsBySupermarket, createProduct, updateProduct, deleteProduct } from "@/src/api/routes/products";

export default function ProductsPage() {
    const { supermarketData } = useAuth();
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<ApiProduct | null>(null);

    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        codigoBarras: "",
        preco: "",
        quantidadeEstoque: "",
        estoqueMinimo: "",
        categoria: "",
    });

    // Load products and suppliers on mount
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
            const productsResult = await getProductsBySupermarket(supermarketData.idSupermercado);
            
            if (productsResult.isSuccess && productsResult.value) {
                setProducts(productsResult.value);
            } else {
                toast.error(productsResult.error || "Erro ao carregar produtos");
            }
        } catch {
            toast.error("Erro ao carregar dados");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigoBarras?.includes(searchTerm)
    );

    const openNewDialog = () => {
        setCurrentProduct(null);
        setFormData({
            nome: "",
            descricao: "",
            codigoBarras: "",
            preco: "",
            quantidadeEstoque: "",
            estoqueMinimo: "",
            categoria: "",
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (product: ApiProduct) => {
        setCurrentProduct(product);
        setFormData({
            nome: product.nome,
            descricao: product.descricao || "",
            codigoBarras: product.codigoBarras || "",
            preco: product.preco.toString(),
            quantidadeEstoque: product.quantidadeEstoque.toString(),
            estoqueMinimo: product.estoqueMinimo?.toString() || "",
            categoria: product.categoria || "",
        });
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nome.trim()) {
            toast.error("Nome é obrigatório!");
            return;
        }

        if (!formData.preco || parseFloat(formData.preco) <= 0) {
            toast.error("Preço deve ser maior que zero!");
            return;
        }

        if (!supermarketData?.idSupermercado) {
            toast.error("Erro: supermercado não identificado");
            return;
        }

        setIsSaving(true);
        
        const productData: ApiProduct = {
            idProduto: currentProduct?.idProduto,
            nome: formData.nome.trim(),
            descricao: formData.descricao.trim() || undefined,
            codigoBarras: formData.codigoBarras.trim() || "",
            preco: parseFloat(formData.preco),
            quantidadeEstoque: parseInt(formData.quantidadeEstoque) || 0,
            estoqueMinimo: parseInt(formData.estoqueMinimo) || 0,
            categoria: formData.categoria.trim() || undefined,
            idSupermercado: supermarketData.idSupermercado,
        };

        try {
            if (currentProduct?.idProduto) {
                const result = await updateProduct(currentProduct.idProduto, productData);
                if (result.isSuccess) {
                    toast.success("Produto atualizado com sucesso!");
                    setIsDialogOpen(false);
                    loadData();
                } else {
                    toast.error(result.error || "Erro ao atualizar produto");
                }
            } else {
                const result = await createProduct(productData);
                if (result.isSuccess) {
                    toast.success("Produto cadastrado com sucesso!");
                    setIsDialogOpen(false);
                    loadData();
                } else {
                    toast.error(result.error || "Erro ao cadastrar produto");
                }
            }
        } catch {
            toast.error("Erro ao salvar produto");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (product: ApiProduct) => {
        if (!product.idProduto) return;
        
        if (confirm(`Tem certeza que deseja excluir o produto "${product.nome}"?`)) {
            try {
                const result = await deleteProduct(product.idProduto);
                if (result.isSuccess) {
                    toast.success("Produto removido com sucesso!");
                    loadData();
                } else {
                    toast.error(result.error || "Erro ao remover produto");
                }
            } catch {
                toast.error("Erro ao remover produto");
            }
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <main className="min-h-screen">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="space-y-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-foreground">
                        Produtos
                    </h1>
                </div>

                <div className="mt-8 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
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

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Código de Barras</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead className="text-right">Preço</TableHead>
                                <TableHead className="text-right">Estoque</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        Nenhum produto encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.idProduto}>
                                        <TableCell className="font-medium">{product.nome}</TableCell>
                                        <TableCell>{product.codigoBarras || "-"}</TableCell>
                                        <TableCell>{product.categoria || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(product.preco)}
                                        </TableCell>
                                        <TableCell className="text-right">{product.quantidadeEstoque}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDelete(product)}
                                                >
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
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{currentProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSave} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nome" className="text-right">Nome *</Label>
                                    <Input
                                        id="nome"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="descricao" className="text-right">Descrição</Label>
                                    <Input
                                        id="descricao"
                                        value={formData.descricao}
                                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="codigoBarras" className="text-right">Cód. Barras</Label>
                                    <Input
                                        id="codigoBarras"
                                        value={formData.codigoBarras}
                                        onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="categoria" className="text-right">Categoria</Label>
                                    <Input
                                        id="categoria"
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="preco" className="text-right">Preço *</Label>
                                    <Input
                                        id="preco"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.preco}
                                        onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="quantidadeEstoque" className="text-right">Estoque</Label>
                                    <Input
                                        id="quantidadeEstoque"
                                        type="number"
                                        min="0"
                                        value={formData.quantidadeEstoque}
                                        onChange={(e) => setFormData({ ...formData, quantidadeEstoque: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="estoqueMinimo" className="text-right">Estoque Mín.</Label>
                                    <Input
                                        id="estoqueMinimo"
                                        type="number"
                                        min="0"
                                        value={formData.estoqueMinimo}
                                        onChange={(e) => setFormData({ ...formData, estoqueMinimo: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Salvar
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </main>
    );
}