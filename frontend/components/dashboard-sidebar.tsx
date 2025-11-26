"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  Warehouse,
  DollarSign,
  UserCog,
  Settings,
  BarChart3,
} from "lucide-react";

// TODO: Substituir ícones placeholder pelos ícones adequados de lucide-react
const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Produtos",
    icon: Package,
    href: "/dashboard/products",
  },
  {
    label: "Clientes",
    icon: Users,
    href: "/dashboard/clients",
  },
  {
    label: "Fornecedores",
    icon: Truck,
    href: "/dashboard/suppliers",
  },
  {
    label: "Vendas",
    icon: ShoppingCart,
    href: "/dashboard/sales",
  },
  {
    label: "Estoque",
    icon: Warehouse,
    href: "/dashboard/stock-movements",
  },
  {
    label: "Financeiro",
    icon: DollarSign,
    href: "/dashboard/financial",
  },
  {
    label: "Usuários",
    icon: UserCog,
    href: "/dashboard/users",
  },
  {
    label: "Relatórios",
    icon: BarChart3,
    href: "/dashboard/reports",
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span className="">VarejoHub</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-muted text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* TODO: Adicionar seção de perfil do usuário/supermercado no rodapé */}
    </div>
  );
}
