"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { SimulationViewport } from "@/components/SimulationViewport";
import { AgentType, cloneMaze, generateMaze, MazeGrid, runAgent, SimulationResult } from "@/lib/agents";

const VALID_AGENT_TYPES = new Set<AgentType>([
  "simple-reflex",
  "model-based",
  "goal-based",
  "utility-based",
  "learning",
]);

function createStableEmptyMaze(size: number): MazeGrid {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
}

export default function VisualizePage() {
  return (
    <Suspense fallback={<VisualizerFallback />}>
      <VisualizeContent />
    </Suspense>
  );
}

function VisualizeContent() {
  const searchParams = useSearchParams();

  const initialAgent = useMemo(() => {
    const fromQuery = searchParams.get("agent") as AgentType | null;
    if (fromQuery && VALID_AGENT_TYPES.has(fromQuery)) {
      return fromQuery;
    }
    return "simple-reflex" as AgentType;
  }, [searchParams]);

  const [gridSize, setGridSize] = useState(10);
  // Use a deterministic initial grid for SSR/CSR parity; random maze is generated after mount.
  const [maze, setMaze] = useState<MazeGrid>(() => createStableEmptyMaze(10));
  const [selectedAgent, setSelectedAgent] = useState<AgentType>(initialAgent);
  const [secondAgent, setSecondAgent] = useState<AgentType>("goal-based");
  const [compareMode, setCompareMode] = useState(false);
  const [speedMs, setSpeedMs] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [primaryResult, setPrimaryResult] = useState<SimulationResult | null>(null);
  const [secondaryResult, setSecondaryResult] = useState<SimulationResult | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);

  const animationIntervalRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);

  const start = useMemo(() => ({ row: 0, col: 0 }), []);
  const goal = useMemo(
    () => ({ row: gridSize - 1, col: gridSize - 1 }),
    [gridSize]
  );

  useEffect(() => {
    setSelectedAgent(initialAgent);
  }, [initialAgent]);

  const clearRunningTimers = useCallback(() => {
    if (animationIntervalRef.current !== null) {
      window.clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    if (elapsedTimerRef.current !== null) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, []);

  const resetSimulationState = useCallback(() => {
    clearRunningTimers();
    setFrameIndex(0);
    setIsRunning(false);
    setPrimaryResult(null);
    setSecondaryResult(null);
    setStartTime(null);
    setEndTime(null);
    setElapsedTimeMs(0);
  }, [clearRunningTimers]);

  const regenerateMaze = useCallback(
    (nextSize: number) => {
      const generated = generateMaze(nextSize);
      console.log("[grid] Maze generated", {
        rows: generated.length,
        cols: generated[0]?.length ?? 0,
        size: nextSize,
      });
      setMaze(generated);
      resetSimulationState();
    },
    [resetSimulationState]
  );

  useEffect(() => {
    regenerateMaze(10);
  }, [regenerateMaze]);

  const runSimulation = useCallback(() => {
    clearRunningTimers();

    const first = runAgent(selectedAgent, cloneMaze(maze), start, goal);
    const second = compareMode ? runAgent(secondAgent, cloneMaze(maze), start, goal) : null;

    setPrimaryResult(first);
    setSecondaryResult(second);
    setFrameIndex(0);
    setIsRunning(true);
    setEndTime(null);

    const startedAt = performance.now();
    setStartTime(startedAt);
    setElapsedTimeMs(0);
    console.log("[time] Simulation started", { startedAt, speedMs });

    const maxFrames = Math.max(first.timeline.length, second?.timeline.length ?? 0, 1);
    let currentFrame = 0;

    elapsedTimerRef.current = window.setInterval(() => {
      setElapsedTimeMs((previous) => {
        const nextElapsed = performance.now() - startedAt;
        return nextElapsed > previous ? nextElapsed : previous;
      });
    }, 16);

    animationIntervalRef.current = window.setInterval(() => {
      currentFrame += 1;
      setFrameIndex(() => currentFrame);

      const currentPoint = first.timeline[Math.min(currentFrame, first.timeline.length - 1)] ?? start;
      console.log("[agent] Position update", {
        frame: currentFrame,
        row: currentPoint.row,
        col: currentPoint.col,
      });

      if (currentFrame >= maxFrames - 1) {
        const endedAt = performance.now();
        clearRunningTimers();
        setEndTime(endedAt);
        setElapsedTimeMs(endedAt - startedAt);
        setIsRunning(false);
        console.log("[time] Simulation stopped", {
          endedAt,
          elapsedMs: endedAt - startedAt,
        });
      }
    }, speedMs);
  }, [clearRunningTimers, compareMode, goal, maze, secondAgent, selectedAgent, speedMs, start]);

  const displayedElapsedMs = useMemo(() => {
    if (startTime === null) {
      return elapsedTimeMs;
    }
    if (endTime !== null) {
      return endTime - startTime;
    }
    return elapsedTimeMs;
  }, [elapsedTimeMs, endTime, startTime]);

  useEffect(() => {
    return () => {
      clearRunningTimers();
      setIsRunning(false);
    };
  }, [clearRunningTimers]);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 pb-12 pt-8 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-3">
          <Link
            href="/"
            className="inline-flex rounded-full border border-zinc-600 px-3 py-1 text-xs text-zinc-300 transition hover:border-cyan-300/70 hover:text-cyan-200"
          >
            Back to Overview
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            AI Agent Maze Visualization
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base">
            Watch how each AI agent navigates the same maze with different decision logic,
            from local reflex behavior to learning through repeated feedback.
          </p>
        </header>

        <ControlPanel
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          compareMode={compareMode}
          onToggleCompare={setCompareMode}
          secondAgent={secondAgent}
          onSelectSecondAgent={setSecondAgent}
          gridSize={gridSize}
          onGridSizeChange={(size) => {
            setGridSize(size);
            regenerateMaze(size);
          }}
          speedMs={speedMs}
          onSpeedChange={setSpeedMs}
          isRunning={isRunning}
          onRun={runSimulation}
          onReset={resetSimulationState}
          onRandomMaze={() => regenerateMaze(gridSize)}
        />

        <section className={`grid gap-6 ${compareMode ? "xl:grid-cols-2" : "xl:grid-cols-1"}`}>
          <SimulationViewport
            title="Primary Simulation"
            grid={maze}
            start={start}
            goal={goal}
            result={primaryResult}
            frameIndex={frameIndex}
            elapsedTimeMs={displayedElapsedMs}
          />

          {compareMode ? (
            <SimulationViewport
              title="Comparison Simulation"
              grid={maze}
              start={start}
              goal={goal}
              result={secondaryResult}
              frameIndex={frameIndex}
              elapsedTimeMs={displayedElapsedMs}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}

function VisualizerFallback() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 pb-12 pt-8 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-700 bg-zinc-900/40 p-6">
        <p className="text-sm text-zinc-300">Preparing simulation environment...</p>
      </div>
    </main>
  );
}
