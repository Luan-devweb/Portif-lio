"use client"; // ✅ garante que é Client Component

import { useState, useEffect } from "react";
import AdminHeader from "../_componetes/header";
import AdminModal from "../_componetes/adminModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Project = {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  isPreview: boolean;
  link: string;
  createdAt?: string;
};

function ProjectsManager({ token }: { token: string | null }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form de criação
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [link, setLink] = useState("");

  // edição
  const [editOpen, setEditOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPreview, setEditIsPreview] = useState(false);
  const [editLink, setEditLink] = useState("");

  // expandir descrição por linha
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const getPid = (p: { _id?: string; id?: string } | null | undefined) =>
    (p as any)?._id ?? (p as any)?.id;
  const normalizeProject = (p: any): Project => ({
    ...p,
    _id: p?._id ?? p?.id,
    id: p?.id ?? p?._id,
  });
  const normalizeList = (list: any[]): Project[] => list.map(normalizeProject);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/projects`, {
        headers: { ...authHeaders },
      });
      if (!res.ok) throw new Error("Falha ao carregar projetos");
      const data: Project[] = await res.json();
      setProjects(normalizeList(data as any[]));
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar projetos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const resetCreateForm = () => {
    setName("");
    setDescription("");
    setIsPreview(false);
    setLink("");
  };

  const handleCreate = async () => {
    if (!token) {
      alert("É necessário estar logado para adicionar projetos.");
      return;
    }
    if (!name || !description || !link) {
      alert("Preencha nome, descrição e link");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ name, description, isPreview, link }),
      });
      if (!res.ok) throw new Error("Erro ao criar projeto");
      const created: Project = await res.json();
      const normalized = normalizeProject(created);
      setProjects((prev) => [normalized, ...prev]);
      resetCreateForm();
    } catch (e: any) {
      alert(e?.message || "Erro ao criar projeto");
    }
  };

  const openEdit = (p: Project) => {
    setEditProject(p);
    setEditName(p.name);
    setEditDescription(p.description);
    setEditIsPreview(p.isPreview);
    setEditLink(p.link);
    setEditOpen(true);
  };

  const readError = async (res: Response) => {
    try {
      const data = await res.json().catch(() => null);
      if (data && (data.message || data.error)) {
        return data.message || data.error;
      }
      const text = await res.text().catch(() => "");
      return text;
    } catch {
      return "";
    }
  };

  const handleUpdate = async () => {
    if (!token || !editProject) return;
    const pid = getPid(editProject);
    if (!pid) {
      alert("ID do projeto ausente.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/projects/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          isPreview: editIsPreview,
          link: editLink,
        }),
      });

      if (!res.ok) {
        const msg = await readError(res);
        if (res.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          return;
        }
        throw new Error(
          `Erro ao atualizar projeto (PUT ${res.status})${
            msg ? ` - ${msg}` : ""
          }`
        );
      }

      let updated: any = null;
      try {
        updated = await res.json();
      } catch {}
      if (updated) {
        const normalized = normalizeProject(updated);
        setProjects((prev) =>
          prev.map((p) =>
            getPid(p) === getPid(normalizeProject(updated)) ? normalized : p
          )
        );
      } else {
        await fetchProjects();
      }
      setEditOpen(false);
      setEditProject(null);
    } catch (e: any) {
      alert(e?.message || "Erro ao atualizar projeto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      alert("É necessário estar logado para deletar projetos.");
      return;
    }
    if (!id) {
      alert("ID do projeto ausente.");
      return;
    }
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders },
      });
      if (!res.ok) throw new Error("Erro ao deletar projeto");
      setProjects((prev) => prev.filter((p) => getPid(p) !== id));
    } catch (e: any) {
      alert(e?.message || "Erro ao deletar projeto");
    }
  };

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 bg-gradient-to-r from-[#0a1f44] to-[#3a5a40]">
      <Card className="bg-slate-950 border border-slate-700 text-slate-100 shadow-xl h-full w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-amber-400">Projetos</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={fetchProjects}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span className="ml-2">Atualizar lista</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulário de criação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-slate-200">
                Nome
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do projeto"
                className="bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="link" className="text-slate-200">
                Link
              </Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-400"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-slate-200">
                Descrição
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-md bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="isPreview"
                checked={isPreview}
                onCheckedChange={setIsPreview}
              />
              <Label htmlFor="isPreview" className="text-slate-200">
                É preview (iframe)?
              </Label>
            </div>
            <div className="flex md:justify-end">
              <Button
                onClick={handleCreate}
                className="bg-amber-500 hover:bg-amber-400 text-black shadow-md"
              >
                <Plus size={16} />
                <span className="ml-2">Adicionar</span>
              </Button>
            </div>
          </div>

          {/* Tabela de listagem */}
          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500 rounded p-2">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-slate-300">Carregando...</div>
          ) : (
            <Table className="bg-slate-900 border border-slate-700 rounded-md overflow-hidden">
              <TableHeader className="bg-slate-800">
                <TableRow>
                  <TableHead className="text-slate-200">Nome</TableHead>
                  <TableHead className="text-slate-200">Descrição</TableHead>
                  <TableHead className="text-slate-200">Link</TableHead>
                  <TableHead className="text-slate-200">Preview</TableHead>
                  <TableHead className="text-slate-200">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p, idx) => (
                  <TableRow
                    key={
                      (p as any)._id ??
                      (p as any).id ??
                      `${p.name}-${p.link}-${idx}`
                    }
                    className="hover:bg-slate-800/70 transition-colors"
                  >
                    <TableCell className="font-medium align-top text-slate-100">
                      {p.name}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="whitespace-pre-wrap break-words text-slate-200">
                        {p.description}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center max-w-[36ch] truncate text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        {p.link}
                      </a>
                    </TableCell>
                    <TableCell className="align-top text-slate-200">
                      {p.isPreview ? "Sim" : "Não"}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-slate-800 hover:bg-slate-700 text-slate-100"
                          onClick={() => openEdit(p)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-500 text-white"
                          onClick={() => handleDelete(getPid(p) as string)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-400 py-6"
                    >
                      Nenhum projeto cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edição */}
      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          if (!o) setEditOpen(false);
        }}
      >
        <DialogContent className="max-w-xl bg-slate-950 text-slate-100 border border-slate-700 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-amber-400">Editar Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-slate-200">
                Nome
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-slate-100"
              />
            </div>
            <div>
              <Label htmlFor="edit-link" className="text-slate-200">
                Link
              </Label>
              <Input
                id="edit-link"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-slate-100"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-slate-200">
                Descrição
              </Label>
              <textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full rounded-md bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="edit-preview"
                checked={editIsPreview}
                onCheckedChange={setEditIsPreview}
              />
              <Label htmlFor="edit-preview" className="text-slate-200">
                É preview (iframe)?
              </Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                className="bg-slate-800 hover:bg-slate-700 text-slate-100"
                onClick={() => setEditOpen(false)}
              >
                <X size={16} />
                <span className="ml-2">Cancelar</span>
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-400 text-black shadow-md"
                onClick={handleUpdate}
              >
                <Save size={16} />
                <span className="ml-2">Salvar</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProjectsPage() {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);

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
    } catch (e) {
      const legacy = localStorage.getItem("token");
      if (legacy) setToken(legacy);
    }
  }, []);

  return (
    <>
      <AdminHeader onProfileClick={() => setShowAdminModal(true)} />

      <AdminModal
        token={token}
        open={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />

      <ProjectsManager token={token} />
    </>
  );
}
