import { MazeGrid, Point } from "@/lib/agents/types";

export const DIRECTIONS: Point[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

export function keyOf(point: Point): string {
  return `${point.row},${point.col}`;
}

export function parseKey(key: string): Point {
  const [row, col] = key.split(",").map(Number);
  return { row, col };
}

export function equalPoints(a: Point, b: Point): boolean {
  return a.row === b.row && a.col === b.col;
}

export function manhattan(a: Point, b: Point): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function inBounds(grid: MazeGrid, point: Point): boolean {
  return (
    point.row >= 0 &&
    point.row < grid.length &&
    point.col >= 0 &&
    point.col < grid[0].length
  );
}

export function isWalkable(grid: MazeGrid, point: Point): boolean {
  return inBounds(grid, point) && grid[point.row][point.col] === 0;
}

export function neighbors(grid: MazeGrid, point: Point): Point[] {
  return DIRECTIONS.map((dir) => ({
    row: point.row + dir.row,
    col: point.col + dir.col,
  })).filter((candidate) => isWalkable(grid, candidate));
}

export function uniquePoints(points: Point[]): Point[] {
  const seen = new Set<string>();
  return points.filter((point) => {
    const key = keyOf(point);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
