"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, XCircle, Loader2, Store } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/src/auth/AuthProvider"

type Status = "loading" | "success" | "error"

export default function AuthCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<Status>("loading")
    const [errorMessage, setErrorMessage] = useState("")
    const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false)

    const { login } = useAuth()

    const authenticateUser = useCallback(async (jwt: string) => {
        try {
            const loginSuccess = await login(jwt);

            if (loginSuccess) {
                setStatus("success");

                setTimeout(() => {
                    const redirectPath = localStorage.getItem("login_redirect") || "/";
                    localStorage.removeItem("login_redirect");
                    window.location.href = redirectPath; 
                }, 1500);

            } else {
                setStatus("error");
                setErrorMessage("Falha ao verificar os dados do usuário. O token pode ser inválido ou ter expirado.");
            }

        } catch (error: unknown) {
            console.error("Erro inesperado no AuthCallback:", error);
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Erro ao processar autenticação. Tente novamente.");
        }
    }, [login]); 

    useEffect(() => {
        if (hasAttemptedAuth) return

        const jwt = searchParams.get("jwt")
    
        setHasAttemptedAuth(true) 

        if (!jwt) {
            setStatus("error")
            setErrorMessage("Link inválido ou expirado. Por favor, solicite um novo link de acesso.")
            return
        }

        authenticateUser(jwt)

    }, [searchParams, authenticateUser, hasAttemptedAuth])

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
                        <Store className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">VarejoHub</h1>
                    <p className="text-sm text-muted-foreground mt-1">Gestão de Supermercado Completa</p>
                </div>

                {/* Status Card */}
                <div className="bg-card border border-border rounded-xl shadow-lg p-8">
                    {status === "loading" && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-primary/10" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-foreground">Verificando seu acesso...</h2>
                                <p className="text-sm text-muted-foreground">
                                    Aguarde enquanto confirmamos suas credenciais.
                                    <br />
                                    Não feche esta página.
                                </p>
                            </div>
                            <div className="flex justify-center gap-1 pt-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                            </div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-accent" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-foreground">Acesso Confirmado!</h2>
                                <p className="text-sm text-muted-foreground">
                                    Bem-vindo ao VarejoHub. Redirecionando você para o sistema...
                                </p>
                            </div>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-6">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                        <XCircle className="w-10 h-10 text-destructive" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-foreground">Erro na Autenticação</h2>
                                </div>
                            </div>

                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertTitle>Não foi possível confirmar seu acesso</AlertTitle>
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>

                            <div className="flex flex-col gap-3">
                                <Button onClick={() => router.push("/login")} className="w-full">
                                    Tente realizar o login novamente
                                </Button>
                                <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                                    Voltar para Início
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    Problemas com o acesso?{" "}
                    <a href="/login" className="text-primary hover:underline">
                        Clique aqui para obter ajuda
                    </a>
                </p>
            </div>
        </div>
    )
}