"use client"

import { useState, useEffect, FormEvent } from "react"
import { useAuth } from "@/src/auth/AuthProvider"
import {
    getUsersBySupermarket,
    createUser,
    updateUser,
    deleteUser,
    type User,
    type UserCreatePayload,
    type UserUpdatePayload,
} from "@/src/api/routes/users"

// Imports de Lojas
import { Supermarket } from "@/src/api/routes/auth"
// import { getSupermarkets } from "@/src/api/management/supermarkets" // (ASSUMIDO que esta API existe)

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Users, Plus, Search, Edit, Trash2, Loader2, AlertCircle, CheckCircle2, Save, Store } from "lucide-react"


// ==========================================================
// FORMULÁRIO DE USUÁRIO
// ==========================================================
interface UserFormProps {
    user: User | null
    supermarketId: number
    onSave: () => void
    onClose: () => void
    setSuccessMessage: (message: string) => void
    setErrorMessage: (message: string) => void
}

const niveisAcesso: User['nivelAcesso'][] = ['Administrador', 'Gerente', 'Caixa', 'Financeiro']

function UserForm({
    user,
    supermarketId,
    onSave,
    onClose,
    setSuccessMessage,
    setErrorMessage,
}: UserFormProps) {
    
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        nivelAcesso: "Caixa" as User['nivelAcesso'],
        idSupermercado: supermarketId
    })
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditMode = user !== null

    useEffect(() => {
        if (user) {
            // Modo Edição: Popula o formulário
            setFormData({
                nome: user.nome,
                email: user.email,
                nivelAcesso: user.nivelAcesso,
                idSupermercado: user.supermercado?.idSupermercado || supermarketId
            })
        } else {
            // Modo Criação: Reseta o formulário
            setFormData({
                nome: "",
                email: "",
                nivelAcesso: "Caixa",
                idSupermercado: supermarketId
            })
        }
    }, [user, supermarketId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value: User['nivelAcesso']) => {
        setFormData((prev) => ({ ...prev, nivelAcesso: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage("")

        try {
            let result;

            if (isEditMode) {
                // Modo Edição (UserUpdateDto)
                const payload: UserUpdatePayload = {
                    idUsuario: user!.idUsuario,
                    nome: formData.nome,
                    nivelAcesso: formData.nivelAcesso,
                    idSupermercado: formData.idSupermercado
                }
                result = await updateUser(user!.idUsuario, payload)
            } else {
                // Modo Criação (UserCreateDto)
                const payload: UserCreatePayload = {
                    nome: formData.nome,
                    email: formData.email,
                    nivelAcesso: formData.nivelAcesso,
                    idSupermercado: supermarketId,
                }
                result = await createUser(payload)
            }

            if (result.isSuccess) {
                setSuccessMessage(
                    `Usuário "${formData.nome}" ${isEditMode ? "atualizado" : "cadastrado"} com sucesso!`,
                )
                onSave() // Recarrega a lista
                onClose() // Fecha o diálogo
            } else {
                setErrorMessage(result.error)
            }
        } catch (err) {
            setErrorMessage(`Erro ao ${isEditMode ? "salvar" : "cadastrar"} usuário.`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    // Desabilita email na edição
                    disabled={isEditMode} 
                />
                {isEditMode && (
                    <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado após a criação.</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="nivelAcesso">Nível de Acesso</Label>
                <Select
                    name="nivelAcesso"
                    value={formData.nivelAcesso}
                    onValueChange={handleSelectChange}
                    required
                >
                    <SelectTrigger id="nivelAcesso">
                        <SelectValue placeholder="Selecione o nível de acesso" />
                    </SelectTrigger>
                    <SelectContent>
                        {niveisAcesso.map((nivel) => (
                            <SelectItem key={nivel} value={nivel}>
                                {nivel}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
                    ) : (
                        <><Save className="w-4 h-4 mr-2" /> Salvar Usuário</>
                    )}
                </Button>
            </DialogFooter>
        </form>
    )
}

// ==========================================================
// COMPONENTE PRINCIPAL DA PÁGINA
// ==========================================================
export default function GestaoUsuariosPage() {
    const { isAuthenticated, isAuthLoaded, userData } = useAuth()
    
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    
    const [selectedSupermarketId, setSelectedSupermarketId] = useState<number | null>(null)
    const [supermarketList, setSupermarketList] = useState<Supermarket[]>([])
    const [isListLoading, setIsListLoading] = useState(false) // Loading do seletor
    
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false) 
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Estado para diálogo de deleção
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Estado para diálogo de criação/edição
    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [userToEdit, setUserToEdit] = useState<User | null>(null)


    // Função para carregar lista de supermercados (para Admin)
    // const loadSupermarketList = async () => {
    //     if (!userData?.eGlobalAdmin) return
        
    //     setIsListLoading(true);
    //     const result = await getSupermarkets(); // (ASSUMIDO que esta API existe)

    //     if (result.isSuccess && result.value) {
    //         setSupermarketList(result.value);
    //     } else {
    //         setError("Falha ao carregar a lista de supermercados.");
    //     }
    //     setIsListLoading(false);
    // };

    // Lógica de auth para definir a loja
    useEffect(() => {
        if (isAuthLoaded) {
            if (isAuthenticated && userData) {
                if (userData.eGlobalAdmin) {
                    // 1. É ADMIN GLOBAL: Carrega a lista de lojas para ele escolher
                    //loadSupermarketList();
                    setSelectedSupermarketId(null); // Aguarda seleção
                } else if (userData.supermercado) {
                    // 2. É USUÁRIO DE LOJA: Define a loja dele automaticamente
                    setSelectedSupermarketId(userData.supermercado.idSupermercado);
                } else {
                    // 3. CASO ESTRANHO: Logado, não é admin, mas não tem loja
                    setError("Usuário autenticado não está vinculado a um supermercado.");
                    setSelectedSupermarketId(null);
                }
            } else {
                // 4. NÃO ESTÁ AUTENTICADO
                setSelectedSupermarketId(null);
                setSupermarketList([]);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthLoaded, isAuthenticated, userData]);


    // Busca usuários quando o ID do supermercado é definido
    useEffect(() => {
        if (selectedSupermarketId) {
            loadUsers()
        } else {
            // Limpa a lista se nenhum supermercado estiver selecionado
            setUsers([])
            setFilteredUsers([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSupermarketId])

    // Filtra usuários
    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase().trim()
        if (lowercasedQuery === "") {
            setFilteredUsers(users)
        } else {
            const filtered = users.filter(
                (user) =>
                    user.nome.toLowerCase().includes(lowercasedQuery) ||
                    user.email.toLowerCase().includes(lowercasedQuery) ||
                    user.nivelAcesso.toLowerCase().includes(lowercasedQuery),
            )
            setFilteredUsers(filtered)
        }
    }, [searchQuery, users])

    // Função para carregar os usuários da loja selecionada
    const loadUsers = async () => {
        if (!selectedSupermarketId) return

        setIsLoading(true)
        setError(null)
        const result = await getUsersBySupermarket(selectedSupermarketId)

        if (result.isSuccess && result.value) {
            setUsers(result.value)
            setFilteredUsers(result.value)
        } else {
            setError(result.error)
        }
        setIsLoading(false)
    }

    // Funções auxiliares de mensagens e diálogos
    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    }
    
    const setSuccessMessage = (message: string) => {
        clearMessages();
        setSuccess(message);
        setTimeout(() => setSuccess(null), 4000);
    }

    const setErrorMessage = (message: string) => {
        clearMessages();
        setError(message);
    }

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!userToDelete?.idUsuario) return

        setIsDeleting(true)
        const result = await deleteUser(userToDelete.idUsuario)

        if (result.isSuccess) {
            setSuccessMessage(`Usuário "${userToDelete.nome}" deletado com sucesso!`)
            setDeleteDialogOpen(false)
            setUserToDelete(null)
            loadUsers(); // Recarrega a lista
        } else {
            setErrorMessage(result.error)
        }
        setIsDeleting(false)
    }

    const handleEditClick = (user: User) => {
        setUserToEdit(user)
        setFormDialogOpen(true)
    }

    const handleAddNewClick = () => {
        setUserToEdit(null) 
        setFormDialogOpen(true)
    }
    
    // Variável de controle para habilitar/desabilitar inputs
    const canManage = !!selectedSupermarketId;

    // Loading inicial (enquanto o 'useAuth' carrega)
    if (!isAuthLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Gestão de Usuários
                    </h1>
                    <p className="text-muted-foreground">Adicione, edite e gerencie os usuários do sistema</p>
                </div>

                {success && (
                    <Alert className="mb-6 border-green-500 bg-green-500/10 text-green-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertTitle>Sucesso!</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Filtros e Ações</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center gap-4">
                        
                        {/* --- Seletor de Loja (Apenas para Admin Global) --- */}
                        {userData?.eGlobalAdmin && (
                            <div className="space-y-2 w-full md:w-auto md:min-w-[250px]">
                                <Label htmlFor="supermarket-select">Selecionar Loja</Label>
                                <Select
                                    // O valor do select deve ser string
                                    value={selectedSupermarketId?.toString() || ""}
                                    onValueChange={(value) => setSelectedSupermarketId(value ? Number.parseInt(value) : null)}
                                    disabled={isListLoading || !userData?.eGlobalAdmin}
                                >
                                    <SelectTrigger id="supermarket-select" className="w-full">
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4 text-muted-foreground" />
                                            <SelectValue placeholder="Selecione uma loja..." />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isListLoading ? (
                                            <SelectItem value="loading" disabled>Carregando...</SelectItem>
                                        ) : (
                                            supermarketList.map((supermarket) => (
                                                <SelectItem 
                                                    key={supermarket.idSupermercado} 
                                                    value={supermarket.idSupermercado.toString()}
                                                >
                                                    {supermarket.nomeFantasia}
                                                </SelectItem>
                                            ))
                                        )}
                                        {!isListLoading && supermarketList.length === 0 && (
                                            <SelectItem value="empty" disabled>Nenhuma loja encontrada.</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {/* --- FIM Seletor de Loja --- */}

                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Buscar por nome, email ou nível de acesso..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                                disabled={!canManage || isLoading} // Desabilita na busca ou se não houver loja
                            />
                        </div>
                        <Button onClick={handleAddNewClick} disabled={!canManage} className="w-full md:w-auto flex-shrink-0">
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Usuário
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Usuários Cadastrados</CardTitle>
                        {/* Mostra contagem apenas se uma loja estiver selecionada */}
                        {canManage && (
                            <CardDescription>{filteredUsers.length} usuário(s) encontrado(s)</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                             <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : !canManage ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>
                                    {userData?.eGlobalAdmin 
                                        ? "Selecione um supermercado para gerenciar usuários."
                                        : "Carregando dados da loja..."}
                                </p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Nenhum usuário encontrado.</p>
                                <Button onClick={handleAddNewClick} className="mt-4">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Cadastrar Primeiro Usuário
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-md border">
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
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.idUsuario}>
                                                <TableCell className="font-medium">{user.nome}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{user.nivelAcesso}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button size="icon" variant="ghost" onClick={() => handleEditClick(user)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        {/* Não permite deletar a si mesmo */}
                                                        {userData?.idUsuario !== user.idUsuario && (
                                                            <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(user)}>
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>

            {/* Diálogo de Confirmação de Exclusão */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja deletar o usuário{" "}
                            <span className="font-semibold text-foreground">&quot;{userToDelete?.nome}&quot;</span>? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            {isDeleting ? "Deletando..." : "Deletar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo de Cadastro/Edição de Usuário */}
            <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{userToEdit ? "Editar Usuário" : "Cadastrar Novo Usuário"}</DialogTitle>
                        <DialogDescription>
                            {userToEdit
                                ? "Atualize as informações do usuário abaixo."
                                : "Preencha os campos para adicionar um novo usuário."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    
                    {/* Renderiza o formulário apenas se a loja estiver selecionada */}
                    {canManage && (
                        <UserForm
                            user={userToEdit}
                            supermarketId={selectedSupermarketId!} // ID é garantido se o botão de add está visível
                            onSave={loadUsers}
                            onClose={() => setFormDialogOpen(false)}
                            setSuccessMessage={setSuccessMessage}
                            setErrorMessage={setErrorMessage}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}