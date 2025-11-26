"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProduct } from "@/src/hooks/use-products";
import { useAuth } from "@/src/auth/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Schema de validação com Zod
const productSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  descricao: z.string().optional(),
  codigoBarras: z.string().optional(),
  precoVenda: z
    .number({ invalid_type_error: "Preço de venda é obrigatório" })
    .positive("Preço de venda deve ser maior que zero"),
  precoCusto: z
    .number({ invalid_type_error: "Preço inválido" })
    .positive("Preço de custo deve ser maior que zero")
    .optional()
    .or(z.literal(0)),
  estoqueAtual: z
    .number({ invalid_type_error: "Estoque é obrigatório" })
    .min(0, "Estoque não pode ser negativo"),
  alertaBaixoEstoque: z
    .number()
    .min(0, "Alerta de estoque não pode ser negativo")
    .optional()
    .or(z.literal(0)),
  unidade: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const createMutation = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      estoqueAtual: 0,
      alertaBaixoEstoque: 0,
      precoCusto: 0,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (!userData?.supermercado?.idSupermercado) {
      return;
    }

    createMutation.mutate(
      {
        ...data,
        idSupermercado: userData.supermercado.idSupermercado,
      },
      {
        onSuccess: () => {
          router.push("/dashboard/products");
        },
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>
            Preencha os dados do novo produto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                {...register("nome")}
                placeholder="Ex: Arroz Tipo 1 5kg"
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                {...register("descricao")}
                placeholder="Descrição do produto"
              />
              {errors.descricao && (
                <p className="text-sm text-red-500">
                  {errors.descricao.message}
                </p>
              )}
            </div>

            {/* Código de Barras */}
            <div className="space-y-2">
              <Label htmlFor="codigoBarras">Código de Barras</Label>
              <Input
                id="codigoBarras"
                {...register("codigoBarras")}
                placeholder="Ex: 7891234567890"
              />
              {errors.codigoBarras && (
                <p className="text-sm text-red-500">
                  {errors.codigoBarras.message}
                </p>
              )}
            </div>

            {/* Grid: Preços */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="precoVenda">
                  Preço de Venda (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="precoVenda"
                  type="number"
                  step="0.01"
                  {...register("precoVenda", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.precoVenda && (
                  <p className="text-sm text-red-500">
                    {errors.precoVenda.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="precoCusto">Preço de Custo (R$)</Label>
                <Input
                  id="precoCusto"
                  type="number"
                  step="0.01"
                  {...register("precoCusto", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.precoCusto && (
                  <p className="text-sm text-red-500">
                    {errors.precoCusto.message}
                  </p>
                )}
              </div>
            </div>

            {/* Grid: Estoque */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="estoqueAtual">
                  Estoque Atual <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="estoqueAtual"
                  type="number"
                  {...register("estoqueAtual", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.estoqueAtual && (
                  <p className="text-sm text-red-500">
                    {errors.estoqueAtual.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertaBaixoEstoque">Alerta Baixo Estoque</Label>
                <Input
                  id="alertaBaixoEstoque"
                  type="number"
                  {...register("alertaBaixoEstoque", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.alertaBaixoEstoque && (
                  <p className="text-sm text-red-500">
                    {errors.alertaBaixoEstoque.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  {...register("unidade")}
                  placeholder="Ex: kg, un, lt"
                />
                {errors.unidade && (
                  <p className="text-sm text-red-500">
                    {errors.unidade.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending ? "Salvando..." : "Salvar Produto"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/products")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* TODO: Adicionar seção de upload de imagem do produto */}
      {/* TODO: Adicionar seção de categorias/tags */}
    </div>
  );
}
