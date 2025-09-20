"use client";

import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import React from "react";
import Link from "next/link";

interface AdminHeaderProps {
  onProfileClick?: () => void;
}

export default function AdminHeader({ onProfileClick }: AdminHeaderProps) {
  return (
    <header className="w-full flex justify-between items-center px-8 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 border-b border-slate-800 shadow-lg shadow-blue-500/10">
      {/* Logo ou Título */}
      <h1 className="text-2xl font-bold text-blue-400 drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]">Admin Panel</h1>

      {/* Área de ações */}
      <div className="flex items-center gap-3">
        {/* Navegação */}
        <Button asChild variant="ghost" className="text-blue-300 hover:text-blue-200 hover:bg-slate-800/40 focus-visible:ring-blue-500/30 px-3 py-2 rounded-md">
          <Link href="/adm/forms">Formulários</Link>
        </Button>
        <Button asChild variant="ghost" className="text-blue-300 hover:text-blue-200 hover:bg-slate-800/40 focus-visible:ring-blue-500/30 px-3 py-2 rounded-md">
          <Link href="/adm/projects">Projetos</Link>
        </Button>

        {/* Botão Perfil com ícone */}
        <Button
          onClick={() => onProfileClick?.()}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 focus-visible:ring-blue-500/30 px-4 py-2 rounded-lg shadow-md"
        >
          <UserCircle2 size={20} />
          Perfil
        </Button>
      </div>
    </header>
  );
}
