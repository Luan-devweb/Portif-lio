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
    label: "Satisfacao de clientes",
    value: 95,
    color: "text-emerald-300",
    suffix: "%",
  },
  { label: "Leads gerados", value: 1800, color: "text-blue-300", suffix: "+" },
  {
    label: "Usuarios impactados",
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
  const [animatedSkills, setAnimatedSkills] = useState(
    skillsData.map(() => 0)
  );
  const [animatedResults, setAnimatedResults] = useState(
    resultsData.map(() => 0)
  );
  const skillsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects`);
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          // Usar projetos estaticos como fallback se a API falhar
          const fallbackProjects: Project[] = [
            {
              id: "1",
              name: "Flowstate — Web App",
              description:
                "Aplicacao web completa para gerenciamento de tarefas e produtividade",
              isPreview: false,
              link: "https://flowstate-app.vercel.app",
            },
            {
              id: "2",
              name: "Portfolio Interativo",
              description: "Landing designer com micro-interacoes",
              isPreview: false,
              link: "https://portfolio-example.vercel.app",
            },
          ];
          setProjects(fallbackProjects);
        }
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Animacao das Skills
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            skillsData.forEach((skill, index) => {
              setTimeout(() => {
                let start = 0;
                const increment = skill.value / 50;
                const timer = setInterval(() => {
                  start += increment;
                  if (start >= skill.value) {
                    start = skill.value;
                    clearInterval(timer);
                  }
                  setAnimatedSkills((prev) => {
                    const newSkills = [...prev];
                    newSkills[index] = Math.round(start);
                    return newSkills;
                  });
                }, 30);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animacao dos Results
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            resultsData.forEach((res, index) => {
              setTimeout(() => {
                let start = 0;
                start += Math.ceil(res.value / 100);
                const increment = res.value / 60;
                const timer = setInterval(() => {
                  start += increment;
                  if (start >= res.value) {
                    start = res.value;
                    clearInterval(timer);
                  }
                  setAnimatedResults((prev) => {
                    const newResults = [...prev];
                    newResults[index] = Math.round(start);
                    return newResults;
                  });
                }, 40);
              }, index * 300);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (resultsRef.current) {
      observer.observe(resultsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const tools = [
    {
      name: "React",
      icon: <SiReact size={32} />,
      color: "#61DAFB",
    },
    {
      name: "Next.js",
      icon: <SiNextdotjs size={32} />,
      color: "#000000",
    },
    {
      name: "JavaScript",
      icon: <SiJavascript size={32} />,
      color: "#F7DF1E",
    },
    {
      name: "Node.js",
      icon: <SiNodedotjs size={32} />,
      color: "#339933",
    },
    {
      name: "Express",
      icon: <SiExpress size={32} />,
      color: "#000000",
    },
    {
      name: "PostgreSQL",
      icon: <SiPostgresql size={32} />,
      color: "#336791",
    },
    {
      name: "MariaDB",
      icon: <SiMariadb size={32} />,
      color: "#003545",
    },
    {
      name: "Figma",
      icon: <SiFigma size={32} />,
      color: "#F24E1E",
    },
    {
      name: "C++",
      icon: <SiCplusplus size={32} />,
      color: "#00599C",
    },
    {
      name: "Python",
      icon: <SiPython size={32} />,
      color: "linear-gradient(45deg, #3776ab 0%, #ffd343 100%)",
    },
    {
      name: "C",
      icon: <SiC size={32} />,
      color: "#A8B9CC",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-blue-900/20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Luan Rodrigues
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              Desenvolvedor Full Stack
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Crio aplicacoes completas, performaticas e escalaveis — do backend
              ao frontend. Experiencia com React, Next.js, Node.js, bancos de
              dados e muito mais.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#projects"
              className="px-8 py-4 bg-emerald-500 text-black rounded-xl font-semibold hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/25"
            >
              Ver Projetos
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border border-emerald-500 text-emerald-300 rounded-xl font-semibold hover:bg-emerald-500/10 transition-all"
            >
              Entre em Contato
            </a>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-emerald-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-300 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-emerald-300">
              Sobre Mim
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Construindo aplicacoes web completas, escalaveis e
                performaticas
              </p>
              <p>
                Ola! Sou{" "}
                <span className="text-emerald-300 font-semibold">
                  Luan Rodrigues
                </span>
                , desenvolvedor Full Stack com foco em aplicacoes web modernas.
                Sou de Minas Gerais e me mudei para Sertaozinho-SP em busca de
                novas oportunidades.
              </p>
              <p>
                Atualmente, estou concluindo o curso de Mecatronica na
                <span className="text-emerald-300"> FATEC de Sertaozinho-SP</span>
                , mas descobri na programacao minha verdadeira
                vocacao. Apesar de tambem gostar da area de automacao, desde cedo
                ja me arriscava a criar pequenos projetos.
              </p>
              <p>
                Gosto de desenvolver solucoes praticas e bem estruturadas, sempre
                buscando as melhores praticas e tecnologias mais atuais. Tenho
                interesse por Inteligencia Artificial e gosto de aplica-la em
                projetos quando faz sentido.
              </p>
              <p>
                Para mim, programar nao e apenas profissao — e tambem uma
                atividade que faco com prazer.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-amber-300">
                {/* O que eu faco */}
                Especialidades
              </h3>
              <p className="text-slate-300 mb-4">
                O que eu faco
              </p>
              <p className="text-slate-400 text-sm mb-4">
                Desenvolvimento Full-Stack, criacao de APIs, integracao com bancos
                de dados e aplicacoes web escalaveis.
              </p>
              <ul className="text-slate-300 text-sm space-y-2">
                <li>• Back-end com Node.js, Express e MariaDB</li>
                <li>• Front-end com React, Next.js e TypeScript</li>
                <li>• Integracao de APIs e micro-servicos</li>
                <li>• Deploy e otimizacao de performance</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-center">
                <div className="text-2xl font-bold text-emerald-300">3+</div>
                <div className="text-sm text-slate-400">Anos de Experiencia</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-center">
                <div className="text-2xl font-bold text-blue-300">50+</div>
                <div className="text-sm text-slate-400">Projetos Concluidos</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section ref={skillsRef} className="container mx-auto px-6 py-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Habilidades
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {skillsData.map((skill, index) => (
            <motion.div
              key={skill.label}
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">{skill.label}</span>
                <span className="text-emerald-300 font-semibold">
                  {animatedSkills[index]}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  style={{ width: `${animatedSkills[index]}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section ref={resultsRef} className="container mx-auto px-6 py-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Resultados
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {resultsData.map((result, index) => (
            <motion.div
              key={result.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${result.color}`}>
                {animatedResults[index]}
                {result.suffix}
              </div>
              <div className="text-slate-400 text-sm">{result.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOOLS SECTION */}
      <section className="container mx-auto px-6 py-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Tecnologias
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial="hidden"
              whileInView="show"
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
