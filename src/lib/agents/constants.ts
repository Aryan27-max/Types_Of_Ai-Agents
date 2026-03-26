import { AgentMeta } from "@/lib/agents/types";

export const AGENTS: AgentMeta[] = [
  {
    id: "simple-reflex",
    name: "Simple Reflex Agent",
    description:
      "Acts only on immediate surroundings without memory. It may loop or get stuck when local choices are misleading.",
    characteristic: "No internal state",
  },
  {
    id: "model-based",
    name: "Model-Based Agent",
    description:
      "Maintains internal memory of explored cells and backtracks when needed, making it more robust in partially observable spaces.",
    characteristic: "Tracks explored world state",
  },
  {
    id: "goal-based",
    name: "Goal-Based Agent",
    description:
      "Plans with search toward a defined target. It computes a valid path before execution, usually with efficient shortest-path behavior.",
    characteristic: "Searches for goal satisfaction",
  },
  {
    id: "utility-based",
    name: "Utility-Based Agent",
    description:
      "Scores alternatives by combining distance and risk, then prefers actions that maximize expected utility.",
    characteristic: "Optimizes a utility score",
  },
  {
    id: "learning",
    name: "Learning Agent",
    description:
      "Improves through repeated trials. Over episodes, it updates action values and converges to stronger policies.",
    characteristic: "Learns from feedback",
  },
];
