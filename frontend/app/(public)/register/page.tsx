"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Building2, CheckCircle2, Loader2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { RegisterRequest } from "@/src/api/routes/auth"
import { useRegisterMutation } from "@/src/hooks/queries/use-auth"


const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/

const formSchema = z.object({
  nomeFantasia: z.string().min(1, "Nome Fantasia é obrigatório").min(3, "Nome deve ter pelo menos 3 caracteres"),
  razaoSocial: z.string().min(1, "Razão Social é obrigatória").min(3, "Razão Social deve ter pelo menos 3 caracteres"),
  cnpj: z.string().min(1, "CNPJ é obrigatório").regex(cnpjRegex, "CNPJ inválido. Use o formato: 00.000.000/0000-00"),
  nomeAdministrador: z
    .string()
    .min(1, "Nome do Administrador é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  emailAdministrador: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
})

type FormValues = z.infer<typeof formSchema>

export default function RegisterPage() {
    const [isSuccess, setIsSuccess] = useState(false)
  const [createdEmail, setCreatedEmail] = useState<string>("")
  
  const registerMutation = useRegisterMutation(setIsSuccess, setCreatedEmail);
  const isLoading = registerMutation.isPending; 

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeFantasia: "",
      razaoSocial: "",
      cnpj: "",
      nomeAdministrador: "",
      emailAdministrador: "",
    },
  })
  

  const onSubmit: SubmitHandler<FormValues> = async (data) => {

  const payload: RegisterRequest = {
    nomeFantasia: data.nomeFantasia,
    razaoSocial: data.razaoSocial,
    cnpj: data.cnpj.replace(/[.\-/]/g, ''), 
    nomeAdmin: data.nomeAdministrador, 
    emailAdmin: data.emailAdministrador, 
  };

    registerMutation.mutate(payload);
  }

    if (isSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <Card className="w-full max-w-lg shadow-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-6 py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Conta Criada com Sucesso!</h2>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  Quase lá! Um **link mágico** foi enviado para o email **{createdEmail}**.
                  <br />
                  Acesse sua caixa de entrada para completar o login.
                </p>
              </div>

              <Alert className="max-w-md text-left bg-yellow-50 border-yellow-200">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <AlertTitle>Não recebeu o email?</AlertTitle>
                <AlertDescription>Verifique sua pasta de spam ou lixo eletrônico.</AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3 pt-4">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/login">Ir para Login</Link>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                  <Link href="/">Voltar ao Início</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center">
        {/* Botão para voltar ao início */}
        <div className="absolute top-4 left-4 z-10">
            <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Voltar ao Início</span>
                </Link>
            </Button>
        </div>

      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12 flex-grow">
        <div className="space-y-6">
          {/* Hero Text */}
          <div className="text-center space-y-3 mb-8 pt-10"> {/* Adicionado pt-10 para não sobrepor o botão */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Teste grátis por 14 dias</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-balance">
              Comece a transformar seu supermercado hoje
            </h1>
            <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
              Preencha os dados abaixo e receba acesso imediato ao VarejoHub. Sem cartão de crédito.
            </p>
          </div>

          <Card className="shadow-lg border-gray-100">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-2xl">Cadastre seu Supermercado</CardTitle>
              </div>
              <CardDescription className="text-base leading-relaxed">
                Crie sua conta e comece a usar todas as funcionalidades do VarejoHub em minutos.
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-8">
                  {/* Dados do Supermercado Section */}
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">Dados do Supermercado</h3>
                      <p className="text-sm text-gray-500 mt-1">Informações da sua empresa</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="nomeFantasia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome Fantasia <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Supermercado Bom Preço" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="razaoSocial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Razão Social <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Supermercado Bom Preço LTDA" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            CNPJ <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="00.000.000/0000-00" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormDescription>Formato: 00.000.000/0000-00</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dados do Administrador Section */}
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">Seus Dados de Acesso</h3>
                      <p className="text-sm text-gray-500 mt-1">Você será o administrador principal da conta</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="nomeAdministrador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Seu Nome Completo <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: João Silva" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailAdministrador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Seu E-mail <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com.br" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormDescription>Enviaremos um link de acesso para este e-mail</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Criando sua conta...
                        </>
                    ) : (
                        "Criar Conta Grátis"
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Ao criar sua conta, você concorda com nossos{" "}
                    <Link href="#" className="underline hover:text-primary">
                      Termos de Serviço
                    </Link>{" "}
                    e{" "}
                    <Link href="#" className="underline hover:text-primary">
                      Política de Privacidade
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Faça login aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
