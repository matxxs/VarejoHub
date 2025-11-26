"use client"

import { useState, useEffect, FormEvent } from "react"

// Imports dos Componentes UI (shadcn/ui)
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

// Imports de Ícones (lucide-react)
import { 
    Package, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Loader2, 
    AlertCircle, 
    CheckCircle2, 
    Save, 
    Store // Ícone adicionado para o seletor de loja
} from "lucide-react"

// Imports das Funções de API de Produtos
import {
    getProductsBySupermarket,
    deleteProduct,
    createProduct,
    updateProduct,
    type Product,
} from "@/src/api/routes/products"

// Imports de Autenticação e API de Lojas
import { useAuth } from "@/src/auth/AuthProvider"
import { Supermarket } from "@/src/api/routes/auth" // Tipo do AuthProvider
// import { getSupermarkets } from "@/src/api/management/supermarkets" // API de Supermercados (ASSUMIDA)


// --- Componente do Formulário ---

interface ProductFormProps {
    product: Product | null
    supermarketId: string
    onSave: () => void
    onClose: () => void
    setSuccessMessage: (message: string) => void
    setErrorMessage: (message: string) => void
}

function ProductForm({
    product,
    supermarketId,
    onSave,
    onClose,
    setSuccessMessage,
    setErrorMessage,
}: ProductFormProps) {
    const [formData, setFormData] = useState({
        nome: "",
        codigoBarras: "",
        unidadeMedida: "UN",
        precoVenda: "",
        precoCusto: "",
        estoqueAtual: "",
        alertaBaixoEstoque: "5",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditMode = product !== null

    useEffect(() => {
        if (product) {
            // Modo Edição: Carrega dados do produto
            setFormData({
                nome: product.nome,
                codigoBarras: product.codigoBarras || "",
                unidadeMedida: product.unidadeMedida,
                precoVenda: product.precoVenda.toString(),
                precoCusto: product.precoCusto?.toString() || "",
                estoqueAtual: product.estoqueAtual.toString(),
                alertaBaixoEstoque: product.alertaBaixoEstoque.toString(),
            })
        } else {
            // Modo Criação: Reseta para valores padrão
            setFormData({
                nome: "",
                codigoBarras: "",
                unidadeMedida: "UN",
                precoVenda: "",
                precoCusto: "",
                estoqueAtual: "",
                alertaBaixoEstoque: "5",
            })
        }
    }, [product])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Handler para o Select
    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage("") // Limpa erros antigos

        try {
            // Objeto de dados alinhado com a interface Product e o backend C#
            const productData: Omit<Product, "idProduto"> & { idProduto?: number } = {
                nome: formData.nome,
                codigoBarras: formData.codigoBarras || undefined, // Envia undefined se vazio (C# string? aceita null)
                unidadeMedida: formData.unidadeMedida,
                // Usa parseFloat para campos decimais
                precoVenda: Number.parseFloat(formData.precoVenda.replace(",", ".")),
                precoCusto: formData.precoCusto ? Number.parseFloat(formData.precoCusto.replace(",", ".")) : undefined,
                estoqueAtual: Number.parseFloat(formData.estoqueAtual.replace(",", ".")), // Estoque pode ser decimal (ex: 1.5 KG)
                alertaBaixoEstoque: Number.parseInt(formData.alertaBaixoEstoque), // Este é inteiro
                idSupermercado: Number.parseInt(supermarketId),
            }

            const result = isEditMode
                ? await updateProduct(product.idProduto!, { ...productData, idProduto: product.idProduto! })
                : await createProduct(productData as Product)

            if (result.isSuccess) {
                setSuccessMessage(
                    `Produto "${productData.nome}" ${isEditMode ? "atualizado" : "cadastrado"} com sucesso!`,
                )
                onSave() // Recarrega a lista de produtos
                onClose() // Fecha o diálogo
            } else {
                setErrorMessage(result.error)
            }
        } catch (err) {
            setErrorMessage(`Erro ao ${isEditMode ? "atualizar" : "cadastrar"} produto. Verifique os campos e tente novamente.`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="codigoBarras">Código de Barras (Opcional)</Label>
                    <Input id="codigoBarras" name="codigoBarras" value={formData.codigoBarras} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="unidadeMedida">Unidade de Medida</Label>
                    <Select
                        name="unidadeMedida"
                        value={formData.unidadeMedida}
                        onValueChange={(value) => handleSelectChange("unidadeMedida", value)}
                        required
                    >
                        <SelectTrigger id="unidadeMedida">
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="UN">Unidade (UN)</SelectItem>
                            <SelectItem value="KG">Quilograma (KG)</SelectItem>
                            <SelectItem value="L">Litro (L)</SelectItem>
                            <SelectItem value="PCT">Pacote (PCT)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="precoVenda">Preço de Venda (R$)</Label>
                    <Input id="precoVenda" name="precoVenda" type="number" step="0.01" value={formData.precoVenda} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="precoCusto">Preço de Custo (R$) (Opcional)</Label>
                    <Input id="precoCusto" name="precoCusto" type="number" step="0.01" value={formData.precoCusto} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="estoqueAtual">Estoque Atual</Label>
                    {/* Permite 3 casas decimais, conforme C# decimal(10, 3) */}
                    <Input id="estoqueAtual" name="estoqueAtual" type="number" step="0.001" value={formData.estoqueAtual} onChange={handleInputChange} required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="alertaBaixoEstoque">Alerta Estoque Baixo</Label>
                    <Input id="alertaBaixoEstoque" name="alertaBaixoEstoque" type="number" step="1" value={formData.alertaBaixoEstoque} onChange={handleInputChange} required />
                </div>
            </div>

            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Produto
                        </>
                    )}
                </Button>
            </DialogFooter>
        </form>
    )
}


// --- Componente Principal da Página ---
export default function ProdutosPage() {
    // Obtendo dados completos do usuário
    const { isAuthenticated, isAuthLoaded, userData } = useAuth()
    
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    
    // Começa vazio, será preenchido pela lógica de auth
    const [selectedSupermarket, setSelectedSupermarket] = useState<string>("") 
    
    // Estado para lista de lojas (para Admins)
    const [supermarketList, setSupermarketList] = useState<Supermarket[]>([])
    const [isListLoading, setIsListLoading] = useState(false) // Loading do seletor de lojas

    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false) // Loading da tabela de produtos
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Estado para o diálogo de deleção
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<Product | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Estado para o diálogo de criação/edição
    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [productToEdit, setProductToEdit] = useState<Product | null>(null)


    // Função para carregar lista de supermercados (para Admin)
    // const loadSupermarketList = async () => {
    //     if (!userData?.eGlobalAdmin) return // Segurança extra
        
    //     setIsListLoading(true);
    //     // NOTA: Certifique-se que esta função exista na sua API
    //     // Ela deve retornar algo como: Result<Supermarket[]>
    //     const result = await getSupermarkets(); 

    //     if (result.isSuccess && result.value) {
    //         setSupermarketList(result.value);
    //     } else {
    //         setError("Falha ao carregar a lista de supermercados.");
    //     }
    //     setIsListLoading(false);
    // };

    // Lógica de autenticação para definir a loja
    useEffect(() => {
        // Roda quando a autenticação estiver carregada
        if (isAuthLoaded) {
            if (isAuthenticated && userData) {
                if (userData.eGlobalAdmin) {
       
                    //loadSupermarketList();
                } else if (userData.supermercado) {
                    setSelectedSupermarket(userData.supermercado.idSupermercado.toString());
                } else {
                    setError("Usuário autenticado não está vinculado a um supermercado.");
                    setSelectedSupermarket("");
                }
            } else {
                setSelectedSupermarket("");
                setSupermarketList([]);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthLoaded, isAuthenticated, userData]);
    
    
    // Verifica autenticação (para redirecionamento)
    useEffect(() => {
        if (isAuthLoaded && !isAuthenticated) {
            console.log("Usuário não autenticado, redirecionando...");
            // router.push("/login") // Descomente quando o router estiver disponível
        }
    }, [isAuthLoaded, isAuthenticated])

    // Carrega produtos quando o supermercado selecionado mudar
    useEffect(() => {
        if (selectedSupermarket) {
            loadProducts()
        } else {
            // Se o admin global des-selecionar (ou estado inicial)
            setProducts([])
            setFilteredProducts([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSupermarket])

    // Filtro de busca
    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase().trim()
        if (lowercasedQuery === "") {
            setFilteredProducts(products)
        } else {
            const filtered = products.filter(
                (product) =>
                    product.nome.toLowerCase().includes(lowercasedQuery) ||
                    (product.codigoBarras && product.codigoBarras.includes(searchQuery)) ||
                    product.unidadeMedida.toLowerCase().includes(lowercasedQuery),
            )
            setFilteredProducts(filtered)
        }
    }, [searchQuery, products])

    // Função para carregar os produtos da loja selecionada
    const loadProducts = async () => {
        if (!selectedSupermarket) return

        setIsLoading(true)
        setError(null)
        const result = await getProductsBySupermarket(Number.parseInt(selectedSupermarket))

        if (result.isSuccess && result.value) {
            setProducts(result.value)
            setFilteredProducts(result.value)
        } else {
            setError(result.error)
        }
        setIsLoading(false)
    }

    // Funções auxiliares para mensagens e diálogos
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

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!productToDelete?.idProduto) return

        setIsDeleting(true)
        const result = await deleteProduct(productToDelete.idProduto)

        if (result.isSuccess) {
            setSuccessMessage(`Produto "${productToDelete.nome}" deletado com sucesso!`)
            setDeleteDialogOpen(false)
            setProductToDelete(null)
            loadProducts(); // Recarrega a lista
        } else {
            setErrorMessage(result.error)
        }
        setIsDeleting(false)
    }

    // Abre o diálogo para editar um produto existente
    const handleEditClick = (product: Product) => {
        setProductToEdit(product)
        setFormDialogOpen(true)
    }

    // Abre o diálogo para criar um novo produto
    const handleAddNewClick = () => {
        setProductToEdit(null) // Garante que está no modo de criação
        setFormDialogOpen(true)
    }

    // Formatação de moeda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    // Status do estoque
    const getStockStatus = (product: Product) => {
        if (product.estoqueAtual === 0) {
            return { label: "Sem Estoque", variant: "destructive" as const }
        }
        if (product.estoqueAtual <= product.alertaBaixoEstoque) {
            return { label: "Estoque Baixo", variant: "outline" as const }
        }
        return { label: "Em Estoque", variant: "secondary" as const }
    }


    // Loading inicial da autenticação
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
                        <Package className="w-8 h-8 text-primary" />
                        Gestão de Produtos
                    </h1>
                    <p className="text-muted-foreground">Gerencie o catálogo de produtos do supermercado</p>
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
                                    value={selectedSupermarket}
                                    onValueChange={(value) => setSelectedSupermarket(value || "")}
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
                                            <SelectItem value="loading" disabled>
                                                Carregando...
                                            </SelectItem>
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
                                        {/* Exibe msg se admin e lista vazia */}
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
                                placeholder="Buscar por nome, código de barras ou unidade..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                                disabled={!selectedSupermarket || isLoading} 
                            />
                        </div>
                        <Button 
                            onClick={handleAddNewClick} 
                            disabled={!selectedSupermarket} // Desabilita se nenhuma loja selecionada
                            className="w-full md:w-auto flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Produto
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Produtos Cadastrados</CardTitle>
                        {selectedSupermarket && (
                            <CardDescription>{filteredProducts.length} produto(s) encontrado(s)</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : !selectedSupermarket ? (
                            // Mensagem padrão (para admin selecionar ou para usuário aguardar)
                            <div className="text-center py-12 text-muted-foreground">
                                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>
                                    {userData?.eGlobalAdmin 
                                        ? "Selecione uma loja para visualizar os produtos."
                                        : "Carregando dados da loja..."}
                                </p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            // Mensagem de "Nenhum produto" (após loja selecionada)
                            <div className="text-center py-12 text-muted-foreground">
                                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Nenhum produto encontrado.</p>
                                <Button onClick={handleAddNewClick} className="mt-4">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Cadastrar Primeiro Produto
                                </Button>
                            </div>
                        ) : (
                            // Tabela de produtos
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>Código de Barras</TableHead>
                                            <TableHead>Un. Medida</TableHead>
                                            <TableHead className="text-right">Preço Venda</TableHead>
                                            <TableHead className="text-center">Estoque</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProducts.map((product) => {
                                            const stockStatus = getStockStatus(product)
                                            return (
                                                <TableRow key={product.idProduto}>
                                                    <TableCell className="font-medium">{product.nome}</TableCell>
                                                    <TableCell className="font-mono text-sm">{product.codigoBarras || "-"}</TableCell>
                                                    <TableCell>{product.unidadeMedida}</TableCell>
                                                    <TableCell className="text-right font-medium">{formatCurrency(product.precoVenda)}</TableCell>
                                                    <TableCell className="text-center">{product.estoqueAtual}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button size="icon" variant="ghost" onClick={() => handleEditClick(product)}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(product)}>
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
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
                            Tem certeza que deseja deletar o produto{" "}
                            <span className="font-semibold text-foreground">&quot;{productToDelete?.nome}&quot;</span>? Esta ação não pode ser desfeita.
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

            {/* Diálogo de Cadastro/Edição de Produto */}
            <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{productToEdit ? "Editar Produto" : "Cadastrar Novo Produto"}</DialogTitle>
                        <DialogDescription>
                            {productToEdit
                                ? "Atualize as informações do produto abaixo."
                                : "Preencha os campos para adicionar um novo produto ao catálogo."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    
                    {/* Renderiza o formulário (apenas se selectedSupermarket estiver definido) */}
                    {selectedSupermarket && (
                        <ProductForm
                            product={productToEdit}
                            supermarketId={selectedSupermarket}
                            onSave={loadProducts}
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