import Link from "next/link";
import { AgentMeta } from "@/lib/agents";

interface AgentCardProps {
  agent: AgentMeta;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <article className="group rounded-2xl border border-cyan-400/20 bg-zinc-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]">
      <h3 className="text-lg font-semibold text-zinc-100">{agent.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-300">{agent.description}</p>
      <div className="mt-4 inline-flex rounded-full border border-violet-300/30 px-3 py-1 text-xs tracking-wide text-violet-200">
        {agent.characteristic}
      </div>
      <div className="mt-6">
        <Link
          href={`/visualize?agent=${agent.id}`}
          className="inline-flex items-center rounded-full border border-cyan-300/60 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-300/10"
        >
          Visualize
        </Link>
      </div>
    </article>
  );
}
