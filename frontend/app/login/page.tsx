"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
import { useAuth } from "@/src/auth/AuthProvider"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { EmailRequest, generateMagicLink, magicLogin } from "@/src/api/auth-requests"
import { toast } from "sonner"
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
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden md:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/modern-supermarket-interior-professional-retail-ma.jpg" alt="VarejoHub background" fill className="object-cover opacity-20" />
        </div>

        <div className="relative z-10">
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
        <div className="md:hidden mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Faça login para continuar</h2>
            {/*<p className="text-muted-foreground leading-relaxed">
              Insira seu e-mail para receber seu Link Mágico de acesso. Rápido e seguro, sem senhas!
            </p> */}
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
                {isLoading ? "loading..." : "Continuar"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Problemas?{" "}
                <Link href="#" className="text-primary hover:underline font-medium">
                  Fale com o Suporte
                </Link>
              </p>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">E-mail Enviado!</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Verifique a sua caixa de entrada (e a pasta de spam) para acessar sua conta.
                </p>
                <p className="text-sm text-muted-foreground">
                  Enviamos para: <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              {/* <Button
                variant="outline"
                className="w-full h-12 text-base bg-transparent"
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
              >
                Tentar outro e-mail
              </Button> */}
            </div>
          )}

          <div className="pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Novo no VarejoHub?{" "}
              <Link href="/" className="text-primary hover:underline font-medium">
                Saiba mais
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
