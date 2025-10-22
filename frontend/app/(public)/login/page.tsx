"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
import { useMagicLinkMutation } from "@/src/hooks/queries/use-auth"

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const magicLinkMutation = useMagicLinkMutation(setIsSubmitted, setIsLoading);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLoading || !email) return; 

        setIsLoading(true);
      
        magicLinkMutation.mutate({ email });
    };

  return (
    <div className="relative min-h-screen grid md:grid-cols-2">
      {/* Botão para voltar ao início - Adicionado para consistência */}
      <div className="absolute top-4 left-4 z-20">
          <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar ao Início</span>
              </Link>
          </Button>
      </div>
      
      {/* Left Side - Branding */}
      <div className="hidden md:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/modern-supermarket-interior-professional-retail-ma.jpg" alt="VarejoHub background" fill className="object-cover opacity-20" />
        </div>

        {/* Link de voltar no desktop - escondido para usar o absoluto */}
        <div className="relative z-10 opacity-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </Link>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center backdrop-blur">
              <span className="text-primary-foreground font-bold text-2xl">V</span>
            </div>
            <span className="text-3xl font-bold">VarejoHub</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
            Sua gestão nunca foi tão simples
          </h1>

          <p className="text-lg text-primary-foreground/80 leading-relaxed text-pretty max-w-md">
            Centralize todas as operações do seu supermercado em uma única plataforma na nuvem.
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-primary-foreground/60">
            <div className="w-px h-12 bg-primary-foreground/20"></div>
            <p className="text-sm">Dados em tempo real para decisões mais inteligentes</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 bg-background">
        {/* Link de voltar no mobile - escondido para usar o absoluto */}
        <div className="md:hidden mb-8 opacity-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-foreground">Faça login para continuar</h2>
            <p className="text-muted-foreground leading-relaxed">
              Insira seu e-mail para receber um link de acesso.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 text-base"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Receber link de acesso"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Link Enviado!</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Verifique sua caixa de entrada (e a pasta de spam) para acessar sua conta.
                </p>
                <p className="text-sm text-muted-foreground pt-2">
                  Enviamos para: <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Cadastre-se agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
