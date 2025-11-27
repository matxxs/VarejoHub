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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/src/auth/AuthProvider";
import { Employee, getEmployeesBySupermarket, createEmployee, updateEmployee, deleteEmployee } from "@/src/api/routes/employee";

export default function EmployeesPage() {
  const { supermarketData } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    nivelAcesso: "Caixa" as Employee['nivelAcesso'],
  });

  // Load employees on mount
  useEffect(() => {
    if (supermarketData?.idSupermercado) {
      loadEmployees();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supermarketData?.idSupermercado]);

  const loadEmployees = async () => {
    if (!supermarketData?.idSupermercado) return;
    
    setIsLoading(true);
    try {
      const result = await getEmployeesBySupermarket(supermarketData.idSupermercado);
      if (result.isSuccess && result.value) {
        setEmployees(result.value);
      } else {
        toast.error(result.error || "Erro ao carregar funcionários");
      }
    } catch {
      toast.error("Erro ao carregar funcionários");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.nivelAcesso?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewDialog = () => {
    setCurrentEmployee(null);
    setFormData({
      nome: "",
      email: "",
      nivelAcesso: "Caixa",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      nome: employee.nome,
      email: employee.email || "",
      nivelAcesso: employee.nivelAcesso,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error("Nome é obrigatório!");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email é obrigatório!");
      return;
    }

    if (!supermarketData?.idSupermercado) {
      toast.error("Erro: supermercado não identificado");
      return;
    }

    setIsSaving(true);

    const employeeData = {
      idUsuario: currentEmployee?.idUsuario || 0,
      idSupermercado: supermarketData.idSupermercado,
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      nivelAcesso: formData.nivelAcesso,
    };

    try {
      if (currentEmployee?.idUsuario) {
        const result = await updateEmployee(currentEmployee.idUsuario, employeeData);
        if (result.isSuccess) {
          toast.success("Funcionário atualizado com sucesso!");
          setIsDialogOpen(false);
          loadEmployees();
        } else {
          toast.error(result.error || "Erro ao atualizar funcionário");
        }
      } else {
        const result = await createEmployee(employeeData);
        if (result.isSuccess) {
          toast.success("Funcionário cadastrado com sucesso!");
          setIsDialogOpen(false);
          loadEmployees();
        } else {
          toast.error(result.error || "Erro ao cadastrar funcionário");
        }
      }
    } catch {
      toast.error("Erro ao salvar funcionário");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (!employee.idUsuario) return;
    
    if (confirm(`Tem certeza que deseja excluir o funcionário "${employee.nome}"?`)) {
      try {
        const result = await deleteEmployee(employee.idUsuario);
        if (result.isSuccess) {
          toast.success("Funcionário removido com sucesso!");
          loadEmployees();
        } else {
          toast.error(result.error || "Erro ao remover funcionário");
        }
      } catch {
        toast.error("Erro ao remover funcionário");
      }
    }
  };

  const getNivelAcessoLabel = (nivel: string) => {
    const labels: Record<string, string> = {
      'Administrador': 'Administrador',
      'Gerente': 'Gerente',
      'Caixa': 'Caixa',
      'Financeiro': 'Financeiro',
    };
    return labels[nivel] || nivel;
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground">
            Funcionários
          </h1>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" /> Novo Funcionário
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nível de Acesso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    Nenhum funcionário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.idUsuario}>
                    <TableCell className="font-medium">{employee.nome}</TableCell>
                    <TableCell>{employee.email || "-"}</TableCell>
                    <TableCell>{getNivelAcessoLabel(employee.nivelAcesso)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(employee)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(employee)}
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
                <DialogTitle>{currentEmployee ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
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
                  <Label htmlFor="email" className="text-right">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nivelAcesso" className="text-right">Cargo *</Label>
                  <Select 
                    value={formData.nivelAcesso} 
                    onValueChange={(value) => setFormData({ ...formData, nivelAcesso: value as Employee['nivelAcesso'] })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                      <SelectItem value="Gerente">Gerente</SelectItem>
                      <SelectItem value="Caixa">Caixa</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
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
