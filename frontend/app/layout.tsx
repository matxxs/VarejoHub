import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainProviders } from "@/src/providers/MainProviders";
import { Suspense } from "react";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "VarejoHub - Gestão de Supermercado na Nuvem",
    description:
        "Centralize Estoque, PDV, Financeiro e Fidelidade em uma única plataforma. Elimine perdas, otimize vendas e tome decisões com dados em tempo real.",
    generator: "v0.app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Suspense fallback={null}>
                   
                    <MainProviders> 
                        {children}
                    </MainProviders>
                </Suspense>
                <Toaster position="bottom-right" /> 
            </body>
        </html>
    );
}