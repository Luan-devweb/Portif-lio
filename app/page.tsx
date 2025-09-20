"use client";
import React, { useEffect, useState, useRef } from "react";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMariadb,
  SiFigma,
  SiCplusplus,
  SiPython,
  SiC,
  SiInstagram,
  SiWhatsapp,
} from "react-icons/si";
import ContactSection from "../components/contact";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const skillsData = [
  { label: "Next.js", value: 95 },
  { label: "TypeScript", value: 92 },
  { label: "Express", value: 90 },
  { label: "MariaDB", value: 88 },
  { label: "React", value: 85 },
  { label: "Node.js", value: 80 },
  { label: "Python", value: 75 },
  { label: "C / C++", value: 40 },
];

const resultsData = [
  {
    label: "Projetos entregues",
    value: 250,
    color: "text-amber-300",
    suffix: "+",
  },
  {
    label: "Satisfação de clientes",
    value: 95,
    color: "text-emerald-300",
    suffix: "%",
  },
  { label: "Leads gerados", value: 1800, color: "text-blue-300", suffix: "+" },
  {
    label: "Usuários impactados",
    value: 12000,
    color: "text-purple-300",
    suffix: "+",
  },
];
interface Project {
  id: string;
  name: string;
  description: string;
  isPreview: boolean;
  link: string;
}

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const skillsRef = useRef<HTMLDivElement | null>(null);
  const [animatedSkills, setAnimatedSkills] = useState(skillsData.map(() => 0));
  const [animatedResults, setAnimatedResults] = useState(
    resultsData.map(() => 0)
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/proxy/projects`);
        if (!res.ok) throw new Error("Erro ao carregar projetos");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        // Usar projetos estáticos como fallback se a API falhar
        setProjects([
          {
            id: "1",
            name: "Flowstate — Web App",
            description: "Redesign de e-commerce com UI moderna",
            isPreview: false,
            link: "/imagem2.jpg",
          },
          {
            id: "2",
            name: "Redsun Dashboard",
            description: "Dashboard analytics com foco em dados",
            isPreview: false,
            link: "/imagem1.jpg",
          },
          {
            id: "3",
            name: "Portfolio Visual",
            description: "Landing designer com micro-interações",
            isPreview: false,
            link: "/imagem4.jpg",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animação das Skills
          skillsData.forEach((skill, i) => {
            let start = 0;
            const interval = setInterval(() => {
              start += 1;
              setAnimatedSkills((prev) => {
                const newSkills = [...prev];
                newSkills[i] = start;
                return newSkills;
              });
              if (start >= skill.value) clearInterval(interval);
            }, 15);
          });

          // Animação dos Results
          resultsData.forEach((res, i) => {
            let start = 0;
            const interval = setInterval(() => {
              start += Math.ceil(res.value / 100); // aumenta mais rápido para valores grandes
              setAnimatedResults((prev) => {
                const newResults = [...prev];
                newResults[i] = Math.min(start, res.value);
                return newResults;
              });
              if (start >= res.value) clearInterval(interval);
            }, 20);
          });
        }
      },
      { threshold: 0.5 }
    );

    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const tools = [
    {
      name: "React",
      color: "rgba(56,189,248,0.6)",
      icon: <SiReact className="text-sky-400" size={36} />,
    },
    {
      name: "Next.js",
      color: "rgba(255,255,255,0.3)",
      icon: <SiNextdotjs className="text-white" size={36} />,
    },
    {
      name: "JavaScript",
      color: "rgba(253,224,71,0.6)",
      icon: <SiJavascript className="text-yellow-400" size={36} />,
    },
    {
      name: "Node.js",
      color: "rgba(34,197,94,0.6)",
      icon: <SiNodedotjs className="text-green-500" size={36} />,
    },
    {
      name: "Express",
      color: "rgba(209,213,219,0.3)",
      icon: <SiExpress className="text-gray-300" size={36} />,
    },
    {
      name: "PostgreSQL",
      color: "rgba(59,130,246,0.6)",
      icon: <SiPostgresql className="text-sky-600" size={36} />,
    },
    {
      name: "MariaDB",
      color: "rgba(96,165,250,0.6)",
      icon: <SiMariadb className="text-blue-400" size={36} />,
    },
    {
      name: "Figma",
      color: "rgba(244,114,182,0.6)",
      icon: <SiFigma className="text-pink-500" size={36} />,
    },
    {
      name: "C++",
      color: "rgba(37,99,235,0.6)",
      icon: <SiCplusplus className="text-blue-600" size={36} />,
    },
    {
      name: "Python",
      color:
        "radial-gradient(circle, rgba(250,204,21,0.4) 0%, rgba(59,130,246,0.4) 80%)",
      icon: <SiPython className="text-yellow-300" size={36} />,
    },
    {
      name: "C",
      color: "rgba(96,165,250,0.6)",
      icon: <SiC className="text-blue-400" size={36} />,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b0b0d] text-slate-100 antialiased">
      {/* FULLSCREEN BACKGROUND */}
      <div className="fixed inset-0 -z-20">
        <img
          src="/imagem5.jpg"
          alt="futuristic background"
          className="w-full h-full object-cover brightness-75"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,6,20,0.45) 0%, rgba(3,3,8,0.85) 60%)",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* NAV */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="text-2xl font-extrabold tracking-tight text-emerald-300">
          Luan<span className="text-amber-400">.</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-slate-300">
          <a href="#projects" className="hover:text-amber-300">
            Projetos
          </a>
          <a href="#skills" className="hover:text-amber-300">
            Skills
          </a>
          <a href="#tools" className="hover:text-amber-300">
            Ferramentas
          </a>
          <a href="#contact" className="hover:text-amber-300">
            Contato
          </a>
        </nav>
        <button className="ml-4 md:ml-0 px-4 py-2 rounded-full bg-amber-500 text-black text-sm font-medium shadow-lg">
          Hire me
        </button>
      </header>

      {/* HERO */}
      <section className="relative container mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <p className="text-sm uppercase tracking-wider text-amber-300/80">
              Desenvolvedor Full-Stack
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
              Eu sou <span className="text-emerald-300">Luan Rodrigues</span>
              <br />
              Desenvolvedor Web
            </h1>
            <p className="mt-6 max-w-xl text-slate-300">
              Crio aplicações completas, performáticas e escaláveis — do backend
              ao frontend. Experiência com React, Next.js, Node.js, bancos de
              dados e APIs.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-500 text-black font-medium shadow"
                href="#contact"
              >
                Contratar
              </a>
              <a
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-700 text-slate-200"
                href="#projects"
              >
                Meus projetos
              </a>
            </div>
          </motion.div>

          {/* VISUAL CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-lg mx-auto"
          >
            <div className="relative py-6">
              {/* BACKGROUND EFFECT */}
              <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-white/5" />
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -left-24 -top-20 w-[45%] h-[45%] rounded-full bg-blue-700/20 blur-3xl transform -translate-x-8 -translate-y-6" />
                  <div className="absolute right-0 -bottom-8 w-[30%] h-[30%] rounded-full bg-blue-900/15 blur-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-blue-600/5 to-transparent" />
                </div>
              </div>

              {/* CENTRAL IMAGE BLOCK */}
              <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 rounded-3xl">
                <div className="mx-auto px-6 flex flex-col items-center">
                  <div className="relative w-full h-56 md:h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center">
                    <img
                      src="/imagem3.jpg"
                      alt="Hero visual"
                      className="max-h-[85%] object-contain drop-shadow-2xl relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-500/10 to-transparent blur-3xl" />
                    <div
                      className="pointer-events-none absolute -inset-1 rounded-3xl border border-transparent"
                      style={{
                        boxShadow:
                          "0 12px 60px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,255,255,0.05)",
                      }}
                    />
                  </div>

                  {/* FEATURE CARD BELOW IMAGE */}
                  <div className="mt-4 w-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <div className="px-5 py-3 rounded-2xl bg-black/50 backdrop-blur-md border border-amber-500/20 shadow-lg text-center">
                      <h4 className="text-lg md:text-xl font-bold text-amber-300">
                        Full-Stack Developer
                      </h4>
                      <p className="mt-1 text-sm md:text-base text-slate-200/80">
                        Construindo aplicações web completas, escaláveis e
                        performáticas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ABOUT ME */}
      <section
        id="about"
        className="relative container mx-auto px-6 py-16 md:py-24"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-300">
          Sobre mim
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Texto */}
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              Sou{" "}
              <span className="text-amber-300 font-semibold">
                Luan Rodrigues
              </span>
              , desenvolvedor Full Stack com foco em aplicações web modernas.
              Sou de Minas Gerais e me mudei para Sertãozinho-SP em busca de
              novas oportunidades de estudo e trabalho.
            </p>

            <p>
              Atualmente, estou concluindo o curso de Mecatrônica na
              <span className="text-emerald-300"> FATEC de Sertãozinho-SP</span>
              , mas foi no desenvolvimento web que encontrei minha verdadeira
              vocação. Apesar de também gostar da área de automação, desde cedo
              já me arriscava a criar pequenos projetos.
            </p>

            <p>
              Gosto de desenvolver soluções práticas e bem estruturadas, sempre
              unindo
              <span className="text-amber-300"> tecnologia</span> e
              <span className="text-amber-300"> usabilidade</span>. Tenho grande
              interesse por Inteligência Artificial e gosto de aplicá-la em
              projetos desafiadores que me permitam aprender continuamente.
            </p>

            <p className="font-medium text-slate-200">
              Para mim, programar não é apenas profissão — é também uma
              atividade que faço com prazer.
            </p>
          </div>

          {/* Imagem */}
          <div className="relative max-w-sm mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10">
              <img
                src="/sobreMim.jpg"
                alt="Foto de Luan Rodrigues"
                className="w-full h-80 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section
        ref={skillsRef}
        id="skills"
        className="container mx-auto px-6 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* O que eu faço */}
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/3 to-white/2 backdrop-blur-md border border-amber-600/10"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <h3 className="text-xl font-semibold text-amber-300">
              O que eu faço
            </h3>
            <p className="mt-3 text-slate-300">
              Desenvolvimento Full-Stack, criação de APIs, integração com bancos
              de dados e aplicações web escaláveis.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>• Back-end com Node.js, Express e MariaDB</li>
              <li>• Front-end com React, Next.js e TypeScript</li>
              <li>• Integração de APIs e micro-serviços</li>
            </ul>
          </motion.div>

          {/* Habilidades */}
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/3 to-white/2 backdrop-blur-md border border-emerald-500/10"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <h3 className="text-xl font-semibold text-emerald-300">
              Habilidades
            </h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Next.js", value: 95, color: "bg-emerald-400" },
                { label: "TypeScript", value: 92, color: "bg-emerald-300" },
                { label: "Express", value: 90, color: "bg-emerald-500" },
                { label: "MariaDB", value: 88, color: "bg-emerald-200" },
                { label: "React", value: 85, color: "bg-sky-400" },
                { label: "Node.js", value: 80, color: "bg-green-500" },
                { label: "Python", value: 75, color: "bg-yellow-400" },
                { label: "C / C++", value: 40, color: "bg-blue-400" },
              ].map((skill, i) => (
                <div key={skill.label} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-200">{skill.label}</span>
                    <span className="text-amber-300">
                      {animatedSkills[i] || 0}%
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.value}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${skill.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Resultados */}
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/3 to-white/2 backdrop-blur-md border border-cyan-400/10"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <h3 className="text-xl font-semibold text-cyan-300">Resultados</h3>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-300">
              {[
                {
                  label: "Projetos entregues",
                  value: 250,
                  color: "text-amber-300",
                  suffix: "+",
                },
                {
                  label: "Satisfação de clientes",
                  value: 95,
                  color: "text-emerald-300",
                  suffix: "%",
                },
                {
                  label: "Leads gerados",
                  value: 1800,
                  color: "text-blue-300",
                  suffix: "+",
                },
                {
                  label: "Usuários impactados",
                  value: 30,
                  color: "text-pink-300",
                  suffix: "+",
                },
              ].map((res, i) => (
                <div
                  key={res.label}
                  className="flex flex-col items-start sm:items-center"
                >
                  <motion.div
                    className={`text-3xl md:text-4xl font-bold ${res.color}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * i,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    {animatedResults[i].toLocaleString()}
                    {res.suffix}
                  </motion.div>
                  <div className="text-sm md:text-base mt-1">{res.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-amber-300 text-center mb-10">
          Ferramentas & Tecnologias
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-black/30 border border-slate-700 transition"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
                e.currentTarget.style.transform = `rotateX(${y}deg) rotateY(${x}deg) scale(1.08)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
              }}
            >
              {/* Glow pulsante */}
              <motion.div
                className="absolute inset-0 rounded-2xl blur-xl"
                style={{
                  background:
                    tool.name === "Python"
                      ? tool.color
                      : `radial-gradient(circle, ${tool.color} 0%, rgba(0,0,0,0) 70%)`,
                }}
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative z-10">{tool.icon}</div>
              <span className="relative z-10 text-sm font-medium">
                {tool.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="container mx-auto px-6 py-16 md:py-24">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Projetos em Destaque
        </motion.h2>
        {loading ? (
          <p className="text-center text-slate-400">Carregando projetos...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-slate-400">
            Nenhum projeto encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, i) => (
              <motion.div
                key={proj.id}
                className="relative rounded-2xl overflow-hidden shadow-lg group bg-slate-900/50 border border-white/5"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <div className="relative h-80 overflow-hidden">
                  {proj.isPreview ? (
                    <iframe
                      src={proj.link}
                      className="w-full h-full rounded-t-2xl"
                      style={{ border: "none" }}
                    />
                  ) : (
                    <img
                      src={proj.link}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 p-5 w-full">
                  <h3 className="text-xl font-semibold text-amber-300">
                    {proj.name}
                  </h3>
                  <p className="text-slate-300 text-sm mt-2">
                    {proj.description}
                  </p>
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400 transition-colors shadow-md"
                  >
                    Ver Projeto
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CONTACT */}
      <ContactSection />
      <footer className="py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Luan Rodrigues — Desenvolvedor Web
      </footer>
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        <motion.a
          href="https://wa.me/5516982217569"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-xl"
          whileHover={{ scale: 1.2 }}
          animate={{
            y: [0, -6, 0],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <SiWhatsapp size={28} />
          <motion.div
            className="absolute w-24 h-24 rounded-full"
            style={{ boxShadow: "0 0 25px #25D366, 0 0 50px #25D36655" }}
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.a>

        <motion.a
          href="https://www.instagram.com/luan.dev_web"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-pink-500 text-white shadow-xl"
          whileHover={{ scale: 1.2 }}
          animate={{
            y: [0, -6, 0],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <SiInstagram size={28} />
          <motion.div
            className="absolute w-24 h-24 rounded-full"
            style={{ boxShadow: "0 0 25px #F58529, 0 0 50px #F5852955" }}
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.a>
      </div>
    </main>
  );
}
