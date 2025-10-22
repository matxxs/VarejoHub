"use client";

import { motion } from "framer-motion";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-destructive/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-destructive/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Shield icon with animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.8,
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-destructive/20 rounded-full blur-xl"
            />
            <ShieldX
              className="w-24 h-24 text-destructive relative"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>

        {/* 403 Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter text-balance">
            <span className="from-destructive via-destructive/80 to-destructive/60 bg-clip-text text-transparent">
              403
            </span>
          </h1>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-balance">
            Acesso Negado
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty">
            Você não tem permissão para acessar esta página. Entre em contato
            com o administrador se acredita que isso é um erro.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href="/" className="gap-2">
              <Home className="w-4 h-4" />
              Ir para Início
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[160px] bg-transparent"
          >
            <Link href="javascript:history.back()" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </Button>
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16"
        >
          <p className="text-sm text-muted-foreground/60">
            Código do erro: <span className="font-mono">403 Forbidden</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
