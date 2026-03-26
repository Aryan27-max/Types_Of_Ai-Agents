import { AGENTS, AgentType } from "@/lib/agents";

interface ControlPanelProps {
  selectedAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
  compareMode: boolean;
  onToggleCompare: (value: boolean) => void;
  secondAgent: AgentType;
  onSelectSecondAgent: (agent: AgentType) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
  isRunning: boolean;
  onRun: () => void;
  onReset: () => void;
  onRandomMaze: () => void;
}

export function ControlPanel({
  selectedAgent,
  onSelectAgent,
  compareMode,
  onToggleCompare,
  secondAgent,
  onSelectSecondAgent,
  gridSize,
  onGridSizeChange,
  speedMs,
  onSpeedChange,
  isRunning,
  onRun,
  onReset,
  onRandomMaze,
}: ControlPanelProps) {
  return (
    <section className="rounded-2xl border border-cyan-500/25 bg-zinc-900/50 p-5 backdrop-blur-xl">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-2 text-sm text-zinc-300">
          Agent Type
          <select
            value={selectedAgent}
            onChange={(event) => onSelectAgent(event.target.value as AgentType)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-cyan-300 transition focus:ring"
          >
            {AGENTS.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-zinc-300">
          Grid Size
          <select
            value={gridSize}
            onChange={(event) => onGridSizeChange(Number(event.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-cyan-300 transition focus:ring"
          >
            {[8, 10, 12, 14].map((size) => (
              <option key={size} value={size}>
                {size} x {size}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-zinc-300">
          Animation Speed
          <select
            value={speedMs}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-cyan-300 transition focus:ring"
          >
            <option value={350}>Slow</option>
            <option value={180}>Medium</option>
            <option value={90}>Fast</option>
          </select>
        </label>

        <label className="flex items-end gap-2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
          <input
            type="checkbox"
            checked={compareMode}
            onChange={(event) => onToggleCompare(event.target.checked)}
          />
          Compare Mode
        </label>

        {compareMode ? (
          <label className="space-y-2 text-sm text-zinc-300">
            Compare Against
            <select
              value={secondAgent}
              onChange={(event) => onSelectSecondAgent(event.target.value as AgentType)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-cyan-300 transition focus:ring"
            >
              {AGENTS.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="hidden xl:block" />
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="rounded-full border border-cyan-300/70 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRunning ? "Running..." : "Run Simulation"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-violet-300/70 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-300/10"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onRandomMaze}
          className="rounded-full border border-zinc-400/70 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-300/10"
        >
          Random Maze
        </button>
      </div>
    </section>
  );
}
