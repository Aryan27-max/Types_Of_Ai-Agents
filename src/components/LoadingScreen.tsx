"use client";

import { motion } from "framer-motion";

interface LoadingScreenProps {
  progress: number;
  done: boolean;
}

export function LoadingScreen({ progress, done }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{ pointerEvents: done ? "none" : "auto" }}
    >
      <div className="w-full max-w-xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold tracking-[0.2em] text-zinc-100 md:text-5xl"
        >
          Types of AI Agents
        </motion.h1>
        <div className="mt-10 overflow-hidden rounded-full border border-cyan-400/50 bg-zinc-900/70">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_22px_rgba(56,189,248,0.7)]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>
        <p className="mt-4 text-sm tracking-[0.4em] text-cyan-300">{progress}%</p>
      </div>
    </motion.div>
  );
}
