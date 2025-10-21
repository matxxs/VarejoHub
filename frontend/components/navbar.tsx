"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Code,
  Palette,
  TrendingUp,
  Camera,
  Heart,
  GraduationCap,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  items: {
    title: string;
    href: string;
  }[];
}

const navigationItems: NavItem[] = [
  {
    label: "Desenvolvimento",
    icon: <Code className="h-4 w-4" />,
    items: [
      { title: "Python", href: "/cursos/python" },
      { title: "JavaScript", href: "/cursos/javascript" },
      { title: "React", href: "/cursos/react" },
      { title: "Node.js", href: "/cursos/nodejs" },
      { title: "Java", href: "/cursos/java" },
      {
        title: "Mais opções em desenvolvimento",
        href: "/cursos/desenvolvimento",
      },
    ],
  },
  {
    label: "Design",
    icon: <Palette className="h-4 w-4" />,
    items: [
      { title: "Figma", href: "/cursos/figma" },
      { title: "Adobe XD", href: "/cursos/adobe-xd" },
      { title: "Photoshop", href: "/cursos/photoshop" },
      { title: "Illustrator", href: "/cursos/illustrator" },
      { title: "UI/UX", href: "/cursos/ui-ux" },
      { title: "Mais opções em design", href: "/cursos/design" },
    ],
  },
  {
    label: "Negócios",
    icon: <TrendingUp className="h-4 w-4" />,
    items: [
      { title: "Marketing Digital", href: "/cursos/marketing" },
      { title: "Empreendedorismo", href: "/cursos/empreendedorismo" },
      { title: "Gestão de Projetos", href: "/cursos/gestao" },
      { title: "Vendas", href: "/cursos/vendas" },
      { title: "Finanças", href: "/cursos/financas" },
      { title: "Mais opções em negócios", href: "/cursos/negocios" },
    ],
  },
  {
    label: "Produtividade",
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      { title: "Microsoft Office", href: "/cursos/microsoft" },
      { title: "Google Workspace", href: "/cursos/google" },
      { title: "Notion", href: "/cursos/notion" },
      { title: "Excel Avançado", href: "/cursos/excel" },
      { title: "Power BI", href: "/cursos/powerbi" },
      { title: "Mais opções em produtividade", href: "/cursos/produtividade" },
    ],
  },
  {
    label: "Fotografia",
    icon: <Camera className="h-4 w-4" />,
    items: [
      { title: "Fotografia Digital", href: "/cursos/fotografia-digital" },
      { title: "Lightroom", href: "/cursos/lightroom" },
      { title: "Edição de Fotos", href: "/cursos/edicao" },
      { title: "Fotografia de Produto", href: "/cursos/produto" },
      { title: "Fotografia de Retrato", href: "/cursos/retrato" },
      { title: "Mais opções em fotografia", href: "/cursos/fotografia" },
    ],
  },
];

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = (label: string) => {
    clearCloseTimeout();
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // 200ms de delay antes de fechar
  };

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, []);

  return (
    <>
      <nav className="border-b border-border bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                V
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">VarejoHub</span>
          </div>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-1">
              {navigationItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      activeDropdown === item.label
                        ? "text-foreground bg-foreground/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Plans Button */}
            <Button
              variant="outline"
              className="hidden font-medium sm:inline-flex bg-transparent"
            >
              Ver Planos
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="/placeholder.svg?height=36&width=36"
                      alt="User"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      João Silva
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      joao@exemplo.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Meus Cursos</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Lista de Desejos</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {activeDropdown && (
        <div
          className="fixed left-0 right-0 top-16 z-40 border-b border-border bg-foreground/20 backdrop-blur supports-[backdrop-filter]:bg-foreground/15 animate-in fade-in slide-in-from-top-2"
          onMouseEnter={clearCloseTimeout}
          onMouseLeave={handleMouseLeave}
        >
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

            <div className="flex flex-wrap items-center justify-center gap-2">
              {navigationItems
                .find((item) => item.label === activeDropdown)
                ?.items.map((subItem, index) => {
                  const isLastItem =
                    index ===
                    navigationItems.find(
                      (item) => item.label === activeDropdown
                    )!.items.length -
                      1;
                  return (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-background/80"
                    >
                      {subItem.title}
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
