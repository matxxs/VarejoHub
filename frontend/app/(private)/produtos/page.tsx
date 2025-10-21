"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
import { Package, Plus, Search, Edit, Trash2, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import {
  getProductsBySupermarket,
  deleteProduct,
  type Product,
} from "@/src/api/management/products"
import { useAuth } from "@/src/auth/AuthProvider"

export default function ProdutosPage() {
  const { userData, supermarketData, isAuthenticated, isAuthLoaded } = useAuth()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  // const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
  const [selectedSupermarket, setSelectedSupermarket] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingSupermarkets, setLoadingSupermarkets] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthLoaded, isAuthenticated, router])

  // Load supermarkets if user is global admin
  // useEffect(() => {
  //   if (userData?.globalAdmin) {
  //     loadSupermarkets()
  //   } else if (supermarketData?.supermarketId) {
  //     setSelectedSupermarket(supermarketData.supermarketId.toString())
  //   }
  // }, [userData, supermarketData])

  // Load products when supermarket is selected
  useEffect(() => {
    if (selectedSupermarket) {
      loadProducts()
    }
  }, [selectedSupermarket])

  // Filter products based on search query
  // useEffect(() => {
  //   if (searchQuery.trim() === "") {
  //     setFilteredProducts(products)
  //   } else {
  //     const filtered = products.filter(
  //       (product) =>
  //         product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         product.codigoBarras.includes(searchQuery) ||
  //         product.categoria?.toLowerCase().includes(searchQuery.toLowerCase()),
  //     )
  //     setFilteredProducts(filtered)
  //   }
  // }, [searchQuery, products])

  // const loadSupermarkets = async () => {
  //   setLoadingSupermarkets(true)
  //   const result = await getAllSupermarkets()
  //   if (result.isSuccess && result.value) {
  //     setSupermarkets(result.value)
  //   }
  //   setLoadingSupermarkets(false)
  // }

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

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete?.idProduto) return

    setIsDeleting(true)
    const result = await deleteProduct(productToDelete.idProduto)

    if (result.isSuccess) {
      setSuccess(`Produto "${productToDelete.nome}" deletado com sucesso!`)
      setProducts(products.filter((p) => p.idProduto !== productToDelete.idProduto))
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error)
    }
    setIsDeleting(false)
  }

  const handleEditClick = (product: Product) => {
    // Redirect to cadastro page with product ID as query param
    router.push(`/dashboard/produtos/cadastro?id=${product.idProduto}`)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStockStatus = (product: Product) => {
    if (product.quantidadeEstoque === 0) {
      return { label: "Sem Estoque", variant: "destructive" as const }
    }
    if (product.quantidadeEstoque <= product.estoqueMinimo) {
      return { label: "Estoque Baixo", variant: "outline" as const }
    }
    return { label: "Em Estoque", variant: "secondary" as const }
  }

  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-foreground">VarejoHub</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{userData?.nome || userData?.email}</span>
            {userData?.eGlobalAdmin && (
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                Admin Global
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Gestão de Produtos
          </h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos do supermercado</p>
        </div>

        {/* Success Alert */}
        {success && (
          <Alert className="mb-6 border-accent bg-accent/10">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Selecione o supermercado e busque produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Supermarket Selection (only for global admins) */}
              {/* {userData?.eGlobalAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="supermarket">Supermercado</Label>
                  <Select
                    value={selectedSupermarket}
                    onValueChange={setSelectedSupermarket}
                    disabled={loadingSupermarkets}
                  >
                    <SelectTrigger id="supermarket">
                      <SelectValue placeholder="Selecione o supermercado" />
                    </SelectTrigger>
                    <SelectContent>
                      {supermarkets.map((supermarket) => (
                        <SelectItem key={supermarket.idSupermercado} value={supermarket.idSupermercado.toString()}>
                          {supermarket.nomeFantasia} 
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )} */}

              {/* Search Input */}
              <div className="space-y-2">
                <Label htmlFor="search">Buscar Produto</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nome, código de barras ou categoria..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    disabled={!selectedSupermarket}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produtos Cadastrados</CardTitle>
                <CardDescription>{filteredProducts.length} produto(s) encontrado(s)</CardDescription>
              </div>
              <Button asChild disabled={!selectedSupermarket}>
                <Link href="/produtos/cadastro">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !selectedSupermarket ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione um supermercado para visualizar os produtos</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum produto encontrado</p>
                <Button asChild className="mt-4 bg-transparent" variant="outline">
                  <Link href="/dashboard/produtos/cadastro">
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Primeiro Produto
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Código de Barras</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Estoque</TableHead>
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
                          <TableCell className="font-mono text-sm">{product.codigoBarras}</TableCell>
                          <TableCell>{product.categoria || "-"}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(product.preco)}</TableCell>
                          <TableCell className="text-right">
                            {product.quantidadeEstoque} / {product.estoqueMinimo}
                          </TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEditClick(product)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(product)}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o produto{" "}
              <span className="font-semibold text-foreground">"{productToDelete?.nome}"</span>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deletando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
