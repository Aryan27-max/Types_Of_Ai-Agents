import { useMemo } from "react";
import { MazeGrid, Point } from "@/lib/agents";
import { keyOf } from "@/lib/agents/utils";

interface GridBoardProps {
  grid: MazeGrid;
  start: Point;
  goal: Point;
  current?: Point | null;
  visited: Point[];
  path: Point[];
}

export function GridBoard({ grid, start, goal, current, visited, path }: GridBoardProps) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const visitedSet = useMemo(() => {
    return new Set(visited.map((point) => keyOf(point)));
  }, [visited]);

  const pathSet = useMemo(() => {
    return new Set(path.map((point) => keyOf(point)));
  }, [path]);

  // Precompute display metadata once per meaningful board update to reduce flicker.
  const displayCells = useMemo(() => {
    const cells: Array<{
      key: string;
      isWall: boolean;
      isStart: boolean;
      isGoal: boolean;
      isCurrent: boolean;
      isVisited: boolean;
      isPath: boolean;
    }> = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const pointKey = `${row},${col}`;
        cells.push({
          key: `${row}-${col}`,
          isWall: grid[row][col] === 1,
          isStart: row === start.row && col === start.col,
          isGoal: row === goal.row && col === goal.col,
          isCurrent: !!current && row === current.row && col === current.col,
          isVisited: visitedSet.has(pointKey),
          isPath: pathSet.has(pointKey),
        });
      }
    }

    return cells;
  }, [cols, current, goal.col, goal.row, grid, pathSet, rows, start.col, start.row, visitedSet]);

  return (
    <div
      className="grid w-full max-w-[560px] gap-1 rounded-2xl border border-zinc-700/70 bg-zinc-950/80 p-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {displayCells.map((cell) => {
        let className = "aspect-square h-full w-full rounded-[4px] border border-zinc-800 bg-zinc-900";

        if (cell.isWall) {
          className = "aspect-square h-full w-full rounded-[4px] border border-zinc-800 bg-zinc-700";
        } else if (cell.isPath) {
          className =
            "aspect-square h-full w-full rounded-[4px] border border-violet-400/50 bg-violet-500/30 shadow-[0_0_10px_rgba(167,139,250,0.45)]";
        } else if (cell.isVisited) {
          className =
            "aspect-square h-full w-full rounded-[4px] border border-cyan-500/40 bg-cyan-500/20";
        }

        if (cell.isStart) {
          className =
            "aspect-square h-full w-full rounded-[4px] border border-emerald-400 bg-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.55)]";
        }

        if (cell.isGoal) {
          className =
            "aspect-square h-full w-full rounded-[4px] border border-amber-300 bg-amber-400/60 shadow-[0_0_14px_rgba(251,191,36,0.7)]";
        }

        if (cell.isCurrent) {
          className =
            "aspect-square h-full w-full rounded-[4px] border border-fuchsia-300 bg-fuchsia-400/70 shadow-[0_0_18px_rgba(232,121,249,0.8)] animate-pulse";
        }

        return <div key={cell.key} className={className} />;
      })}
    </div>
  );
}
