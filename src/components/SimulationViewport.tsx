import { GridBoard } from "@/components/GridBoard";
import { AGENTS, MazeGrid, Point, SimulationResult } from "@/lib/agents";

interface SimulationViewportProps {
  title: string;
  grid: MazeGrid;
  start: Point;
  goal: Point;
  result: SimulationResult | null;
  frameIndex: number;
  elapsedTimeMs: number;
}

export function SimulationViewport({
  title,
  grid,
  start,
  goal,
  result,
  frameIndex,
  elapsedTimeMs,
}: SimulationViewportProps) {
  const activeTimeline = result?.timeline ?? [start];
  const current = activeTimeline[Math.min(frameIndex, activeTimeline.length - 1)] ?? start;

  const animatedVisited = result ? result.visited.slice(0, Math.max(frameIndex + 1, 1)) : [];
  const animatedPath =
    result && frameIndex >= activeTimeline.length - 1
      ? result.path
      : result?.path.slice(0, Math.max(frameIndex + 1, 1)) ?? [];

  const agentName = result
    ? AGENTS.find((agent) => agent.id === result.agent)?.name ?? "Unknown Agent"
    : "Not simulated";

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-700/70 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        <span className="text-xs tracking-wide text-cyan-300">{agentName}</span>
      </div>

      <GridBoard
        grid={grid}
        start={start}
        goal={goal}
        current={current}
        visited={animatedVisited}
        path={animatedPath}
      />

      <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300 md:grid-cols-3">
        <Metric label="Status" value={result ? (result.success ? "Success" : "Failure") : "-"} />
        <Metric label="Steps" value={result ? String(result.steps) : "-"} />
        <Metric
          label="Animation Time"
          value={result ? `${(elapsedTimeMs / 1000).toFixed(2)} s` : "-"}
        />
        <Metric
          label="Compute Time"
          value={result ? `${result.executionMs.toFixed(2)} ms` : "-"}
        />
        <Metric label="Visited" value={result ? String(result.visited.length) : "-"} />
        <Metric
          label="Episodes"
          value={result?.episodes ? String(result.episodes) : "-"}
        />
        <Metric
          label="Path Length"
          value={result ? String(result.path.length) : "-"}
        />
      </div>

      {result?.failureReason ? (
        <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {result.failureReason}
        </p>
      ) : null}
    </section>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-zinc-100">{value}</div>
    </div>
  );
}
