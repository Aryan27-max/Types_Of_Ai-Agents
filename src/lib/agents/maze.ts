import { MazeGrid, Point } from "@/lib/agents/types";

export function generateMaze(size: number, density = 0.22): MazeGrid {
  const grid: MazeGrid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => (Math.random() < density ? 1 : 0))
  );

  const start: Point = { row: 0, col: 0 };
  const goal: Point = { row: size - 1, col: size - 1 };

  grid[start.row][start.col] = 0;
  grid[goal.row][goal.col] = 0;

  for (let i = 0; i < size; i += 1) {
    grid[i][i] = 0;
  }

  return grid;
}

export function cloneMaze(grid: MazeGrid): MazeGrid {
  return grid.map((row) => [...row]);
}
