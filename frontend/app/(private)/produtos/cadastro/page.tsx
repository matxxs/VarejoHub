"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Package, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import {
  createProduct,
  updateProduct,
  getProductById,
  type Product,
  type Supermarket,
} from "@/src/api/management/products"
import { useAuth } from "@/src/auth/AuthProvider"

export default function CadastroProdutoPage() {
  const { userData, supermarketData, isAuthenticated, isAuthLoaded } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("id")

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
  const [loadingSupermarkets, setLoadingSupermarkets] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    codigoBarras: "",
    preco: "",
    quantidadeEstoque: "",
    estoqueMinimo: "",
    categoria: "",
    descricao: "",
    idSupermercado: "",
  })

  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthLoaded, isAuthenticated, router])

  useEffect(() => {
    if (productId) {
      setIsEditMode(true)
      loadProduct(Number.parseInt(productId))
    }
  }, [productId])

  const loadProduct = async (id: number) => {
    setIsLoadingProduct(true)
    const result = await getProductById(id)

    if (result.isSuccess && result.value) {
      const product = result.value
      setFormData({
        nome: product.nome,
        codigoBarras: product.codigoBarras,
        preco: product.preco.toString(),
        quantidadeEstoque: product.quantidadeEstoque.toString(),
        estoqueMinimo: product.estoqueMinimo.toString(),
        categoria: product.categoria || "",
        descricao: product.descricao || "",
        idSupermercado: product.idSupermercado.toString(),
      })
    } else {
      setError(result.error)
    }
    setIsLoadingProduct(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const product: Product = {
        nome: formData.nome,
        codigoBarras: formData.codigoBarras,
        preco: Number.parseFloat(formData.preco),
        quantidadeEstoque: Number.parseInt(formData.quantidadeEstoque),
        estoqueMinimo: Number.parseInt(formData.estoqueMinimo),
        categoria: formData.categoria || undefined,
        descricao: formData.descricao || undefined,
        idSupermercado: Number.parseInt(formData.idSupermercado),
      }

      let result
      if (isEditMode && productId) {
        product.idProduto = Number.parseInt(productId)
        result = await updateProduct(Number.parseInt(productId), product)
      } else {
        result = await createProduct(product)
      }

      if (result.isSuccess) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard/produtos")
        }, 1500)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(`Erro ao ${isEditMode ? "atualizar" : "cadastrar"} produto. Tente novamente.`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthLoaded || isLoadingProduct) {
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
              <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full font-medium">
                Admin Global
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/produtos">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              {isEditMode ? "Editar Produto" : "Cadastro de Produto"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? "Atualize as informações do produto" : "Adicione um novo produto ao estoque do supermercado"}
            </p>
          </div>

        </div>

        {/* Success Alert */}
        {success && (
          <Alert className="mb-6 border-accent bg-accent/10">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <AlertTitle>{isEditMode ? "Produto atualizado!" : "Produto cadastrado!"}</AlertTitle>
            <AlertDescription>
              {isEditMode
                ? "As informações do produto foram atualizadas com sucesso."
                : "O produto foi adicionado ao estoque e já está disponível no sistema."}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTitle>Erro ao {isEditMode ? "atualizar" : "cadastrar"} produto</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
            <CardDescription>
              Preencha os dados do produto que será {isEditMode ? "atualizado" : "adicionado ao estoque"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Ex: Arroz Branco 5kg"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Barcode */}
              <div className="space-y-2">
                <Label htmlFor="codigoBarras">Código de Barras *</Label>
                <Input
                  id="codigoBarras"
                  name="codigoBarras"
                  placeholder="Ex: 7891234567890"
                  value={formData.codigoBarras}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Price and Stock Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$) *</Label>
                  <Input
                    id="preco"
                    name="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.preco}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidadeEstoque">Quantidade *</Label>
                  <Input
                    id="quantidadeEstoque"
                    name="quantidadeEstoque"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.quantidadeEstoque}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estoqueMinimo">Estoque Mínimo *</Label>
                  <Input
                    id="estoqueMinimo"
                    name="estoqueMinimo"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.estoqueMinimo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  name="categoria"
                  placeholder="Ex: Alimentos, Bebidas, Limpeza"
                  value={formData.categoria}
                  onChange={handleInputChange}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Informações adicionais sobre o produto..."
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading || !formData.idSupermercado} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isEditMode ? "Atualizando..." : "Cadastrando..."}
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4 mr-2" />
                      {isEditMode ? "Atualizar Produto" : "Cadastrar Produto"}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/produtos">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
