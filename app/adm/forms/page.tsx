"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Trash2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import AdminHeader from "../_componetes/header";
import AdminModal from "../_componetes/adminModal";

type Formulario = {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  mensagem: string;
  status: "novo" | "respondido";
  criadoEm: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminPage() {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<Formulario | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Recupera token do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("adminToken");
      if (raw) {
        const parsed = JSON.parse(raw) as {
          value?: string;
          expiresAt?: number;
        };
        if (parsed?.expiresAt && parsed.expiresAt < Date.now()) {
          localStorage.removeItem("adminToken");
        } else if (parsed?.value) {
          setToken(parsed.value);
          return;
        }
      }
      const legacy = localStorage.getItem("token");
      if (legacy) setToken(legacy);
    } catch {
      const legacy = localStorage.getItem("token");
      if (legacy) setToken(legacy);
    }
  }, []);

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated } = await import("@/lib/auth");
      if (!isAuthenticated()) {
        router.push("/adm/login");
      }
    };
    checkAuth();
  }, [router]);

  // Função para buscar formulários (reutilizável)
  const fetchFormularios = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`/api/proxy/users`, {
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          router.push("/adm/login");
          return;
        }
        throw new Error("Erro ao buscar formulários");
      }

      const data = await response.json();

      const mapped: Formulario[] = data.map((item: any) => ({
        id: String(item._id || item.id),
        nome: item.name || "Sem nome",
        email: item.email || "",
        telefone: item.phone ? String(item.phone) : "",
        mensagem: item.description || "Sem mensagem",
        status: item.status === "respondido" ? "respondido" : "novo",
        criadoEm: new Date(item.createdAt).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      }));

      setFormularios(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados do backend ao carregar
  useEffect(() => {
    if (token) fetchFormularios();
  }, [token, router]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      console.error("Erro ao copiar!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este registro?")) return;

    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`/api/proxy/users/${id}`, {
        method: "DELETE",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          router.push("/adm/login");
          return;
        }
        throw new Error("Erro ao apagar registro");
      }

      setFormularios((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir formulário");
    }
  };

  // Marcar como respondido ao abrir modal
  const handleView = async (form: Formulario) => {
    setSelected(form);

    if (form.status === "novo") {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`/api/proxy/users/${form.id}/status`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: "respondido" }),
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            router.push("/adm/login");
            return;
          }
          throw new Error("Erro ao atualizar status");
        }

        setFormularios((prev) =>
          prev.map((f) =>
            f.id === form.id ? { ...f, status: "respondido" } : f
          )
        );
      } catch (err) {
        console.error(err);
        alert("Erro ao atualizar status");
      }
    }
  };

  return (
    <>
      <AdminHeader onProfileClick={() => setShowAdminModal(true)} />

      <AdminModal
        open={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        // passe outras props necessárias, ex: token, user info, etc
      />

      {/* Header com mesmo layout e funcionalidade de Projects */}
      {/* Mantive o restante do layout */}

      <div className="min-h-screen text-slate-100 px-6 py-12 bg-gradient-to-r from-[#0a1f44] to-[#3a5a40]">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-100">
          Painel Administrativo
        </h1>

        <Card className="bg-slate-900 border border-slate-700 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl text-amber-400">
              Formulários Recebidos
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={fetchFormularios}
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-700 text-slate-100"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                <span className="ml-2">Atualizar lista</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-slate-400">Carregando...</p>
            ) : formularios.length === 0 ? (
              <p className="text-center text-slate-400">
                Nenhum formulário recebido.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400">
                      Nome / Empresa
                    </TableHead>
                    <TableHead className="text-slate-400">Contato</TableHead>
                    <TableHead className="text-slate-400">Mensagem</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Data</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formularios.map((form) => (
                    <TableRow
                      key={form.id}
                      className="hover:bg-slate-800 transition-colors"
                    >
                      <TableCell className="text-slate-200 font-medium">
                        {form.nome}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {form.email && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="justify-start text-slate-300 hover:text-amber-400"
                              onClick={() => handleCopy(form.email!)}
                            >
                              <Copy size={14} className="mr-2" />
                              {copied === form.email ? "Copiado!" : form.email}
                            </Button>
                          )}
                          {form.telefone && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="justify-start text-slate-300 hover:text-amber-400"
                              onClick={() => handleCopy(form.telefone!)}
                            >
                              <Copy size={14} className="mr-2" />
                              {copied === form.telefone
                                ? "Copiado!"
                                : form.telefone}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs text-slate-400 truncate">
                        {form.mensagem}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            form.status === "novo"
                              ? "bg-emerald-600/20 text-emerald-400 border-emerald-600/30"
                              : "bg-slate-700/40 text-slate-300 border-slate-600"
                          }
                        >
                          {form.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {form.criadoEm}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-amber-500 text-black hover:bg-amber-400"
                          onClick={() => handleView(form)}
                        >
                          <Eye size={16} className="mr-2" /> Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-500"
                          onClick={() => handleDelete(form.id)}
                        >
                          <Trash2 size={16} className="mr-2" /> Apagar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal Detalhes */}
        <Dialog
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        >
          <DialogContent className="bg-slate-900 border border-slate-700 text-slate-200 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-amber-400">
                Detalhes do Formulário
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Visualize todas as informações enviadas pelo usuário.
              </DialogDescription>
            </DialogHeader>

            {selected && (
              <div className="space-y-4 mt-4">
                <p>
                  <span className="font-semibold text-slate-300">Nome:</span>{" "}
                  {selected.nome}
                </p>
                {selected.email && (
                  <p>
                    <span className="font-semibold text-slate-300">Email:</span>{" "}
                    {selected.email}
                  </p>
                )}
                {selected.telefone && (
                  <p>
                    <span className="font-semibold text-slate-300">
                      Telefone:
                    </span>{" "}
                    {selected.telefone}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-slate-300">
                    Mensagem:
                  </span>
                </p>
                <p className="bg-slate-800 p-3 rounded-lg text-slate-300">
                  {selected.mensagem}
                </p>
                <p className="text-sm text-slate-500">
                  Recebido em: {selected.criadoEm}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
