"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AgentCard } from "@/components/AgentCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AGENTS } from "@/lib/agents";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => setLoadingComplete(true), 400);
          return 100;
        }
        return Math.min(prev + 4, 100);
      });
    }, 70);

    return () => window.clearInterval(timer);
  }, []);

  const cardAnimation = useMemo(
    () => ({
      hidden: { opacity: 0, y: 18 },
      visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 + index * 0.08, duration: 0.45 },
      }),
    }),
    []
  );

  return (
    <>
      <LoadingScreen progress={progress} done={loadingComplete} />

      <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-[-15%] right-[-10%] h-[460px] w-[460px] rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <section className="relative mx-auto flex w-full max-w-6xl flex-col px-4 pb-20 pt-28 md:px-8">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 16 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-6xl">
              Types of AI Agents
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-lg">
              AI agents observe an environment, make decisions, and act to achieve objectives.
              This interactive experience shows how five classic agent architectures behave
              differently in the same maze.
            </p>
            <div className="mt-8">
              <Link
                href="/visualize"
                className="inline-flex rounded-full border border-cyan-300/70 px-5 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-300/10"
              >
                Open Visualizer
              </Link>
            </div>
          </motion.header>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {AGENTS.map((agent, index) => (
              <motion.div
                key={agent.id}
                variants={cardAnimation}
                initial="hidden"
                animate={loadingComplete ? "visible" : "hidden"}
                custom={index}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
