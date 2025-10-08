import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

import { MainProviders } from "@/src/providers/MainProviders"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "VarejoHub - Gestão de Supermercado na Nuvem",
  description:
    "Centralize Estoque, PDV, Financeiro e Fidelidade em uma única plataforma. Elimine perdas, otimize vendas e tome decisões com dados em tempo real.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <MainProviders>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </MainProviders>
       <Toaster /> 
        <Analytics />
      </body>
    </html>
  )
}
