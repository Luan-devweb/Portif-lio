// app/adm/components/AdminModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Admin = {
  _id: string;
  name?: string;
  email: string;
};

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  token?: string | null;
}

export default function AdminModal({ open, onClose, token }: AdminModalProps) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(token ?? null);
  const [deletingIds, setDeletingIds] = useState<string[]>([]); // ids em processo de delete

  // fallback do token: se a prop token não veio, tenta pegar do localStorage (várias chaves comuns)
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      return;
    }
    if (typeof window === "undefined") return;
    const stored =
      localStorage.getItem("adminToken") ??
      localStorage.getItem("token") ??
      localStorage.getItem("admin_token") ??
      null;
    setAuthToken(stored);
  }, [token]);

  // Buscar administradores quando o modal abrir e tivermos token
  useEffect(() => {
    if (!open || !authToken) return;

    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/proxy/adm`, {
          headers: { Authorization: `Bearer ${authToken}`, Accept: "application/json" },
          cache: "no-store",
        });
        if (res.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          try {
            localStorage.removeItem("adminToken");
          } catch {}
          window.location.href = "/adm/login";
          return;
        }
        if (!res.ok) {
          const text = await res.text();
          console.error("GET /adm failed:", res.status, text);
          throw new Error(text || "Erro ao carregar administradores");
        }
        const data = await res.json();
        setAdmins(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("fetchAdmins error:", err);
        alert("Erro ao carregar administradores (veja console)");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [open, authToken]);

  // Adicionar novo administrador
  const handleAddAdmin = async () => {
    if (!authToken) return alert("É necessário estar logado.");
    if (!newEmail || !newPassword) return alert("Preencha email e senha");

    try {
      const res = await fetch(`/api/proxy/adm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
        cache: "no-store",
      });

      const text = await res.text();
      if (!res.ok) {
        console.error("POST /adm failed:", res.status, text);
        throw new Error(text || "Erro ao criar administrador");
      }

      const created = text ? JSON.parse(text) : null;
      // se servidor retorna { id, email } ou { message }, tratamos com fallback
      if (created && created.id) {
        setAdmins((prev) => [
          ...prev,
          { _id: created.id, email: created.email },
        ]);
      } else if (created && created._id) {
        setAdmins((prev) => [...prev, created]);
      } else {
        // se não devolve o admin completo, refetch a lista
        // (mantemos a UX atual sem duplicados)
        // opcional: simplesmente refetch
      }
      setNewEmail("");
      setNewPassword("");
      alert("Administrador criado com sucesso");
    } catch (err) {
      console.error("handleAddAdmin error:", err);
      alert("Erro ao adicionar administrador (veja console)");
    }
  };

  // Atualizar — mantém comportamento atual (PUT/PATCH conforme sua API)
  const handleUpdateAdmin = async (id: string) => {
    if (!authToken) return alert("É necessário estar logado.");

    const email = editId === id ? editEmail : "";
    const password = editId === id ? editPassword : "";
    if (!email && !password) return alert("Informe novo email e/ou senha.");

    try {
      const res = await fetch(`/api/proxy/adm/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email || undefined,
          password: password || undefined,
        }),
        cache: "no-store",
      });

      const text = await res.text();
      if (res.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        try {
          localStorage.removeItem("adminToken");
        } catch {}
        window.location.href = "/adm/login";
        return;
      }
      if (!res.ok) {
        console.error("PUT /adm/:id failed:", res.status, text);
        throw new Error(text || "Erro ao atualizar administrador");
      }

      const updated = text ? JSON.parse(text) : null;
      if (updated && (updated.id || updated._id || updated.email)) {
        setAdmins((prev) =>
          prev.map((a) =>
            a._id === id
              ? { ...a, email: updated.email ?? email ?? a.email }
              : a
          )
        );
      } else {
        setAdmins((prev) =>
          prev.map((a) => (a._id === id ? { ...a, email: email || a.email } : a))
        );
      }

      setEditId(null);
      setEditEmail("");
      setEditPassword("");
      alert("Administrador atualizado com sucesso");
    } catch (err) {
      console.error("handleUpdateAdmin error:", err);
      alert("Erro ao atualizar administrador (veja console)");
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!authToken) return alert("É necessário estar logado.");
    if (!confirm("Tem certeza que deseja excluir este administrador?")) return;

    setDeletingIds((s) => (s.includes(id) ? s : [...s, id]));
    try {
      const res = await fetch(`/api/proxy/adm/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const text = await res.text();
      if (res.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        try {
          localStorage.removeItem("adminToken");
        } catch {}
        window.location.href = "/adm/login";
        return;
      }

      if (!res.ok) {
        console.error("DELETE /adm/:id failed:", res.status, text);
        try {
          const parsed = JSON.parse(text);
          alert(parsed.error || parsed.message || `Erro: ${res.status}`);
        } catch {
          alert(text || `Erro ao excluir administrador (status ${res.status})`);
        }
        setDeletingIds((s) => s.filter((x) => x !== id));
        return;
      }

      setAdmins((prev) => prev.filter((a) => a._id !== id));
      alert("Administrador excluído com sucesso");
    } catch (err) {
      console.error("handleDeleteAdmin error:", err);
      alert("Erro ao excluir administrador (veja console)");
    } finally {
      setDeletingIds((s) => s.filter((x) => x !== id));
    }
  };

  const isDeleting = (id: string) => deletingIds.includes(id);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-2xl bg-slate-950 text-white border border-slate-700 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-400">
            Administradores
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Visualize, adicione, edite ou exclua administradores.
          </DialogDescription>
        </DialogHeader>

        {!authToken && (
          <div className="mt-2 p-3 rounded-md bg-amber-600/20 border border-amber-400 text-amber-200 text-sm">
            É necessário estar logado para visualizar e gerenciar
            administradores.
            <a className="underline ml-1" href="/adm/login">
              Fazer login
            </a>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {/* adicionar */}
          <div className="flex gap-2">
            <Input
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={!authToken}
              className="bg-slate-800 text-white placeholder-slate-400"
            />
            <Input
              placeholder="Senha"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!authToken}
              className="bg-slate-800 text-white placeholder-slate-400"
            />
            <Button
              onClick={handleAddAdmin}
              disabled={!authToken || loading}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              Adicionar
            </Button>
          </div>

          {/* tabela */}
          {loading ? (
            <p className="text-center text-slate-300">Carregando...</p>
          ) : (
            <Table className="bg-slate-900 border border-slate-700 rounded-md overflow-hidden">
              <TableHeader className="bg-slate-800/90">
                <TableRow>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white w-64">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow
                    key={admin._id}
                    className="hover:bg-slate-800/70 transition-colors"
                  >
                    <TableCell className="text-slate-200">
                      {admin.email}
                    </TableCell>
                    <TableCell>
                      {editId === admin._id ? (
                        <div className="flex gap-2 flex-wrap">
                          <Input
                            placeholder="Novo email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="bg-slate-800 text-white placeholder-slate-400 w-48"
                          />
                          <Input
                            placeholder="Nova senha"
                            type="password"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            className="bg-slate-800 text-white placeholder-slate-400 w-48"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleUpdateAdmin(admin._id)}
                            className="bg-amber-500 hover:bg-amber-600 text-black"
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditId(null);
                              setEditEmail("");
                              setEditPassword("");
                            }}
                            className="bg-slate-600 hover:bg-slate-700 text-white"
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditId(admin._id);
                              setEditEmail(admin.email);
                              setEditPassword("");
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-black"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting(admin._id)}
                          >
                            {isDeleting(admin._id) ? "Excluindo..." : "Excluir"}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {admins.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center text-slate-300"
                    >
                      Nenhum administrador encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
