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
import { Client, getClientsBySupermarket, createClient, updateClient, deleteClient } from "@/src/api/routes/client";

export default function ClientsPage() {
  const { supermarketData } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    pontosFidelidade: "0",
  });

  // Load clients on mount
  useEffect(() => {
    if (supermarketData?.idSupermercado) {
      loadClients();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supermarketData?.idSupermercado]);

  const loadClients = async () => {
    if (!supermarketData?.idSupermercado) return;
    
    setIsLoading(true);
    try {
      const result = await getClientsBySupermarket(supermarketData.idSupermercado);
      if (result.isSuccess && result.value) {
        setClients(result.value);
      } else {
        toast.error(result.error || "Erro ao carregar clientes");
      }
    } catch {
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf?.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewDialog = () => {
    setCurrentClient(null);
    setFormData({
      nome: "",
      cpf: "",
      email: "",
      pontosFidelidade: "0",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setCurrentClient(client);
    setFormData({
      nome: client.nome,
      cpf: client.cpf || "",
      email: client.email || "",
      pontosFidelidade: client.pontosFidelidade.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error("Nome é obrigatório!");
      return;
    }

    if (!supermarketData?.idSupermercado) {
      toast.error("Erro: supermercado não identificado");
      return;
    }

    setIsSaving(true);

    const clientData = {
      idCliente: currentClient?.idCliente || 0,
      idSupermercado: supermarketData.idSupermercado,
      nome: formData.nome.trim(),
      cpf: formData.cpf.trim() || undefined,
      email: formData.email.trim() || undefined,
      pontosFidelidade: parseInt(formData.pontosFidelidade) || 0,
    };

    try {
      if (currentClient?.idCliente) {
        const result = await updateClient(currentClient.idCliente, clientData);
        if (result.isSuccess) {
          toast.success("Cliente atualizado com sucesso!");
          setIsDialogOpen(false);
          loadClients();
        } else {
          toast.error(result.error || "Erro ao atualizar cliente");
        }
      } else {
        const result = await createClient(clientData);
        if (result.isSuccess) {
          toast.success("Cliente cadastrado com sucesso!");
          setIsDialogOpen(false);
          loadClients();
        } else {
          toast.error(result.error || "Erro ao cadastrar cliente");
        }
      }
    } catch {
      toast.error("Erro ao salvar cliente");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (client: Client) => {
    if (!client.idCliente) return;
    
    if (confirm(`Tem certeza que deseja excluir o cliente "${client.nome}"?`)) {
      try {
        const result = await deleteClient(client.idCliente);
        if (result.isSuccess) {
          toast.success("Cliente removido com sucesso!");
          loadClients();
        } else {
          toast.error(result.error || "Erro ao remover cliente");
        }
      } catch {
        toast.error("Erro ao remover cliente");
      }
    }
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground">
            Clientes
          </h1>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
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
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.idCliente}>
                    <TableCell className="font-medium">{client.nome}</TableCell>
                    <TableCell>{client.cpf || "-"}</TableCell>
                    <TableCell>{client.email || "-"}</TableCell>
                    <TableCell className="text-right">{client.pontosFidelidade}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(client)}
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
                <DialogTitle>{currentClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
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
                  <Label htmlFor="cpf" className="text-right">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="col-span-3"
                    placeholder="000.000.000-00"
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
                  <Label htmlFor="pontosFidelidade" className="text-right">Pontos</Label>
                  <Input
                    id="pontosFidelidade"
                    type="number"
                    value={formData.pontosFidelidade}
                    onChange={(e) => setFormData({ ...formData, pontosFidelidade: e.target.value })}
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
