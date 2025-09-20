"use client";

import { useState } from "react";
import { Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<"email" | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    let digits = value.replace(/\D/g, "");
    if (digits.length > 11) digits = digits.slice(0, 11);
    // Formata como (DD 99999-9999) ou (DD 9999-9999)
    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
        .replace(/-$/, "");
    } else {
      return digits
        .replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
        .replace(/-$/, "");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Aplica máscara no telefone
    if (name === "phone") {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "email" && errorField === "email") {
      setErrorField(null);
      setErrorMessage(null);
    }
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || (!formData.email && !formData.phone)) {
      setStatus("error");
      setErrorMessage(
        "Informe seu nome e pelo menos um contato (email ou telefone)."
      );
      setErrorField(null);
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    setErrorField(null);

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.message, // backend espera "description"
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      // Verifica email duplicado de forma mais ampla
      const msg = (data?.message || data?.error || "").toLowerCase();
      const isDuplicate =
        res.status === 409 ||
        data?.code === "EMAIL_EXISTS" ||
        /email.*(exist|já.*usad|já.*utilizad|já.*cadastrad)/i.test(msg);

      if (isDuplicate) {
        setStatus("error");
        setErrorField("email");
        setErrorMessage(
          "Este email já foi utilizado para contato. Use outro email ou aguarde nosso retorno."
        );
        return;
      }

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        if (res.status === 400 || res.status === 422) {
          setErrorMessage(
            data?.message ||
              "Dados inválidos. Verifique as informações e tente novamente."
          );
        } else {
          setErrorMessage(
            "Erro ao enviar sua mensagem. Tente novamente em instantes."
          );
        }
        setStatus("error");
      }
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
      setErrorMessage("Falha de rede ao enviar. Verifique sua conexão.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="container mx-auto px-6 py-16">
      <div className="rounded-3xl p-8 bg-gradient-to-br from-white/3 to-white/2 backdrop-blur-md border border-amber-500/8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lado esquerdo: informações */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-amber-300">
            Vamos trabalhar juntos?
          </h2>
          <p className="mt-3 text-slate-300">
            Para agilizar o atendimento, me envie os detalhes do seu projeto e
            entrarei em contato para entendermos juntos as melhores soluções.
          </p>
          <div className="mt-6 space-y-4 text-slate-200">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleCopy("+55 16 98221-7569", "phone")}
            >
              {copied === "phone" ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : (
                <Phone
                  size={18}
                  className="text-emerald-400 group-hover:scale-110 transition"
                />
              )}
              <span>
                {copied === "phone" ? "Copiado!" : "+55 16 98221-7569"}
              </span>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleCopy("luan44177@gmail.com", "email")}
            >
              {copied === "email" ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : (
                <Mail
                  size={18}
                  className="text-emerald-400 group-hover:scale-110 transition"
                />
              )}
              <span>
                {copied === "email" ? "Copiado!" : "luan44177@gmail.com"}
              </span>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome / Empresa"
            className="w-full p-3 rounded-xl bg-black/40 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-amber-400 outline-none transition"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className={`w-full p-3 rounded-xl bg-black/40 border text-slate-100 focus:ring-2 outline-none transition ${
              errorField === "email"
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-700 focus:ring-amber-400"
            }`}
          />
          {errorField === "email" && errorMessage && (
            <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
          )}
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefone / WhatsApp"
            type="tel"
            className="w-full p-3 rounded-xl bg-black/40 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-amber-400 outline-none transition"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Descreva o projeto"
            rows={5}
            className="w-full p-3 rounded-xl bg-black/40 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-amber-400 outline-none transition"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl font-medium shadow-md transition-all duration-300
              ${
                status === "success"
                  ? "bg-emerald-500 text-black"
                  : status === "error"
                  ? "bg-red-500 text-white"
                  : "bg-amber-500 text-black hover:bg-amber-400"
              }`}
          >
            {status === "loading" && (
              <>
                <Loader2 className="animate-spin" size={18} /> Enviando...
              </>
            )}
            {status === "success" && "Enviado!"}
            {status === "error" &&
              (errorMessage ? errorMessage : "Erro ao enviar")}
            {status === "idle" && "Enviar mensagem"}
          </button>
        </form>
      </div>
    </section>
  );
}
