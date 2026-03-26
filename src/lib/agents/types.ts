export type AgentType =
  | "simple-reflex"
  | "model-based"
  | "goal-based"
  | "utility-based"
  | "learning";

export type GridCell = 0 | 1;
export type MazeGrid = GridCell[][];

export interface Point {
  row: number;
  col: number;
}

export interface SimulationResult {
  agent: AgentType;
  success: boolean;
  steps: number;
  executionMs: number;
  path: Point[];
  timeline: Point[];
  visited: Point[];
  episodes?: number;
  failureReason?: string;
}

export interface AgentMeta {
  id: AgentType;
  name: string;
  description: string;
  characteristic: string;
}
