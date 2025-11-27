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
import { Supplier, getSuppliersBySupermarket, createSupplier, updateSupplier, deleteSupplier } from "@/src/api/routes/supplier";

export default function SuppliersPage() {
  const { supermarketData } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  
  const [formData, setFormData] = useState({
    nomeFantasia: "",
    cnpj: "",
    email: "",
    telefone: "",
  });

  // Load suppliers on mount
  useEffect(() => {
    if (supermarketData?.idSupermercado) {
      loadSuppliers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supermarketData?.idSupermercado]);

  const loadSuppliers = async () => {
    if (!supermarketData?.idSupermercado) return;
    
    setIsLoading(true);
    try {
      const result = await getSuppliersBySupermarket(supermarketData.idSupermercado);
      if (result.isSuccess && result.value) {
        setSuppliers(result.value);
      } else {
        toast.error(result.error || "Erro ao carregar fornecedores");
      }
    } catch {
      toast.error("Erro ao carregar fornecedores");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.cnpj?.includes(searchTerm) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewDialog = () => {
    setCurrentSupplier(null);
    setFormData({
      nomeFantasia: "",
      cnpj: "",
      email: "",
      telefone: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setFormData({
      nomeFantasia: supplier.nomeFantasia,
      cnpj: supplier.cnpj || "",
      email: supplier.email || "",
      telefone: supplier.telefone || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomeFantasia.trim()) {
      toast.error("Nome fantasia é obrigatório!");
      return;
    }

    if (!supermarketData?.idSupermercado) {
      toast.error("Erro: supermercado não identificado");
      return;
    }

    setIsSaving(true);

    const supplierData = {
      idFornecedor: currentSupplier?.idFornecedor || 0,
      idSupermercado: supermarketData.idSupermercado,
      nomeFantasia: formData.nomeFantasia.trim(),
      cnpj: formData.cnpj.trim() || undefined,
      email: formData.email.trim() || undefined,
      telefone: formData.telefone.trim() || undefined,
    };

    try {
      if (currentSupplier?.idFornecedor) {
        const result = await updateSupplier(currentSupplier.idFornecedor, supplierData);
        if (result.isSuccess) {
          toast.success("Fornecedor atualizado com sucesso!");
          setIsDialogOpen(false);
          loadSuppliers();
        } else {
          toast.error(result.error || "Erro ao atualizar fornecedor");
        }
      } else {
        const result = await createSupplier(supplierData);
        if (result.isSuccess) {
          toast.success("Fornecedor cadastrado com sucesso!");
          setIsDialogOpen(false);
          loadSuppliers();
        } else {
          toast.error(result.error || "Erro ao cadastrar fornecedor");
        }
      }
    } catch {
      toast.error("Erro ao salvar fornecedor");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (supplier: Supplier) => {
    if (!supplier.idFornecedor) return;
    
    if (confirm(`Tem certeza que deseja excluir o fornecedor "${supplier.nomeFantasia}"?`)) {
      try {
        const result = await deleteSupplier(supplier.idFornecedor);
        if (result.isSuccess) {
          toast.success("Fornecedor removido com sucesso!");
          loadSuppliers();
        } else {
          toast.error(result.error || "Erro ao remover fornecedor");
        }
      } catch {
        toast.error("Erro ao remover fornecedor");
      }
    }
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground">
            Fornecedores
          </h1>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CNPJ ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" /> Novo Fornecedor
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Fantasia</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Nenhum fornecedor encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.idFornecedor}>
                    <TableCell className="font-medium">{supplier.nomeFantasia}</TableCell>
                    <TableCell>{supplier.cnpj || "-"}</TableCell>
                    <TableCell>{supplier.email || "-"}</TableCell>
                    <TableCell>{supplier.telefone || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(supplier)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(supplier)}
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{currentSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nomeFantasia" className="text-right">Nome *</Label>
                  <Input
                    id="nomeFantasia"
                    value={formData.nomeFantasia}
                    onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cnpj" className="text-right">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="col-span-3"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="telefone" className="text-right">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
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
