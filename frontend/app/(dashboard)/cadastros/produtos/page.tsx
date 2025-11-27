"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
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
import { useData, Product } from "@/src/contexts/DataContext";
import { toast } from "sonner";

export default function ProductsPage() {
    const { products, suppliers, addProduct, updateProduct, deleteProduct } = useData();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        barcode: "",
        price: "",
        cost: "",
        stock: "",
        unit: "",
        supplierId: "",
    });

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm)
    );

    const openNewDialog = () => {
        setCurrentProduct(null);
        setFormData({
            name: "",
            description: "",
            barcode: "",
            price: "",
            cost: "",
            stock: "",
            unit: "",
            supplierId: "",
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (product: Product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            description: product.description || "",
            barcode: product.barcode || "",
            price: product.price.toString(),
            cost: product.cost?.toString() || "",
            stock: product.stock.toString(),
            unit: product.unit || "",
            supplierId: product.supplierId || "",
        });
        setIsDialogOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error("Nome é obrigatório!");
            return;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error("Preço deve ser maior que zero!");
            return;
        }

        const productData = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            barcode: formData.barcode.trim() || undefined,
            price: parseFloat(formData.price),
            cost: formData.cost ? parseFloat(formData.cost) : undefined,
            stock: parseInt(formData.stock) || 0,
            unit: formData.unit.trim() || undefined,
            supplierId: formData.supplierId === "none" ? undefined : formData.supplierId || undefined,
        };

        if (currentProduct) {
            updateProduct(currentProduct.id, productData);
            toast.success("Produto atualizado com sucesso!");
        } else {
            addProduct(productData);
            toast.success("Produto cadastrado com sucesso!");
        }

        setIsDialogOpen(false);
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
            deleteProduct(product.id);
            toast.success("Produto removido com sucesso!");
        }
    };

    const getSupplierName = (supplierId?: string) => {
        if (!supplierId) return "-";
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier?.tradeName || "-";
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
                                <TableHead>Fornecedor</TableHead>
                                <TableHead className="text-right">Preço</TableHead>
                                <TableHead className="text-right">Estoque</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        Nenhum produto encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.barcode || "-"}</TableCell>
                                        <TableCell>{getSupplierName(product.supplierId)}</TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(product.price)}
                                        </TableCell>
                                        <TableCell className="text-right">{product.stock}</TableCell>
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
                                    <Label htmlFor="name" className="text-right">Nome *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">Descrição</Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                    <Label htmlFor="supplier" className="text-right">Fornecedor</Label>
                                    <Select value={formData.supplierId} onValueChange={(value) => setFormData({ ...formData, supplierId: value })}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Selecione um fornecedor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhum</SelectItem>
                                            {suppliers.map((supplier) => (
                                                <SelectItem key={supplier.id} value={supplier.id}>
                                                    {supplier.tradeName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="price" className="text-right">Preço *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="cost" className="text-right">Custo</Label>
                                    <Input
                                        id="cost"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="stock" className="text-right">Estoque</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="unit" className="text-right">Unidade</Label>
                                    <Input
                                        id="unit"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        className="col-span-3"
                                        placeholder="ex: UN, KG, L"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit">Salvar</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </main>
    );
}