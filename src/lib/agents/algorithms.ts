import {
  AgentType,
  MazeGrid,
  Point,
  SimulationResult,
} from "@/lib/agents/types";
import {
  equalPoints,
  keyOf,
  manhattan,
  neighbors,
  parseKey,
  uniquePoints,
} from "@/lib/agents/utils";

function reconstructPath(cameFrom: Map<string, string>, goalKey: string): Point[] {
  const path: Point[] = [];
  let current = goalKey;

  while (current) {
    path.push(parseKey(current));
    const parent = cameFrom.get(current);
    if (!parent) {
      break;
    }
    current = parent;
  }

  return path.reverse();
}

function buildResult(
  agent: AgentType,
  startTime: number,
  success: boolean,
  path: Point[],
  timeline: Point[],
  visited: Point[],
  episodes?: number,
  failureReason?: string
): SimulationResult {
  return {
    agent,
    success,
    steps: Math.max(path.length - 1, 0),
    executionMs: performance.now() - startTime,
    path,
    timeline,
    visited: uniquePoints(visited),
    episodes,
    failureReason,
  };
}

function riskPenalty(grid: MazeGrid, point: Point): number {
  const checks: Point[] = [
    { row: point.row - 1, col: point.col },
    { row: point.row + 1, col: point.col },
    { row: point.row, col: point.col - 1 },
    { row: point.row, col: point.col + 1 },
  ];

  return checks.reduce((risk, candidate) => {
    const outOfBounds =
      candidate.row < 0 ||
      candidate.row >= grid.length ||
      candidate.col < 0 ||
      candidate.col >= grid[0].length;

    if (outOfBounds) {
      return risk + 0.35;
    }

    if (grid[candidate.row][candidate.col] === 1) {
      return risk + 1;
    }

    return risk;
  }, 0);
}

export function runSimpleReflex(grid: MazeGrid, start: Point, goal: Point): SimulationResult {
  const startTime = performance.now();
  const maxSteps = grid.length * grid[0].length * 3;

  let current = { ...start };
  const path: Point[] = [{ ...current }];
  const visited: Point[] = [{ ...current }];

  for (let step = 0; step < maxSteps; step += 1) {
    if (equalPoints(current, goal)) {
      return buildResult("simple-reflex", startTime, true, path, path, visited);
    }

    const options = neighbors(grid, current);
    if (!options.length) {
      return buildResult(
        "simple-reflex",
        startTime,
        false,
        path,
        path,
        visited,
        undefined,
        "No valid immediate move"
      );
    }

    const scored = options
      .map((option) => ({
        point: option,
        distance: manhattan(option, goal),
      }))
      .sort((a, b) => a.distance - b.distance);

    const bestDistance = scored[0].distance;
    const ties = scored.filter((entry) => entry.distance === bestDistance);
    const next = ties[Math.floor(Math.random() * ties.length)].point;

    current = next;
    path.push({ ...current });
    visited.push({ ...current });
  }

  return buildResult(
    "simple-reflex",
    startTime,
    false,
    path,
    path,
    visited,
    undefined,
    "Exceeded max steps due to local loops"
  );
}

export function runModelBased(grid: MazeGrid, start: Point, goal: Point): SimulationResult {
  const startTime = performance.now();
  const maxSteps = grid.length * grid[0].length * 4;
  const visitedSet = new Set<string>([keyOf(start)]);
  const parent = new Map<string, string>();

  let current = { ...start };
  const path: Point[] = [{ ...current }];
  const visited: Point[] = [{ ...current }];

  for (let step = 0; step < maxSteps; step += 1) {
    if (equalPoints(current, goal)) {
      return buildResult("model-based", startTime, true, path, path, visited);
    }

    const options = neighbors(grid, current);
    const unexplored = options.filter((option) => !visitedSet.has(keyOf(option)));

    if (unexplored.length) {
      unexplored.sort((a, b) => manhattan(a, goal) - manhattan(b, goal));
      const next = unexplored[0];
      parent.set(keyOf(next), keyOf(current));
      current = next;
      visitedSet.add(keyOf(current));
      path.push({ ...current });
      visited.push({ ...current });
      continue;
    }

    const parentKey = parent.get(keyOf(current));
    if (!parentKey) {
      break;
    }

    current = parseKey(parentKey);
    path.push({ ...current });
    visited.push({ ...current });
  }

  return buildResult(
    "model-based",
    startTime,
    false,
    path,
    path,
    visited,
    undefined,
    "Backtracked through explored space without reaching goal"
  );
}

export function runGoalBased(grid: MazeGrid, start: Point, goal: Point): SimulationResult {
  const startTime = performance.now();
  const queue: Point[] = [start];
  const seen = new Set<string>([keyOf(start)]);
  const cameFrom = new Map<string, string>();
  const visitedOrder: Point[] = [start];

  while (queue.length) {
    const current = queue.shift() as Point;
    if (equalPoints(current, goal)) {
      const path = reconstructPath(cameFrom, keyOf(goal));
      return buildResult("goal-based", startTime, true, path, path, visitedOrder);
    }

    for (const next of neighbors(grid, current)) {
      const nextKey = keyOf(next);
      if (seen.has(nextKey)) {
        continue;
      }
      seen.add(nextKey);
      cameFrom.set(nextKey, keyOf(current));
      queue.push(next);
      visitedOrder.push(next);
    }
  }

  return buildResult(
    "goal-based",
    startTime,
    false,
    [start],
    [start],
    visitedOrder,
    undefined,
    "No path to goal"
  );
}

export function runUtilityBased(grid: MazeGrid, start: Point, goal: Point): SimulationResult {
  const startTime = performance.now();

  const open: Point[] = [start];
  const openSet = new Set<string>([keyOf(start)]);
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[keyOf(start), 0]]);
  const visitedOrder: Point[] = [start];

  while (open.length) {
    open.sort((a, b) => {
      const aKey = keyOf(a);
      const bKey = keyOf(b);
      const scoreA =
        (gScore.get(aKey) ?? Number.POSITIVE_INFINITY) +
        manhattan(a, goal) +
        riskPenalty(grid, a);
      const scoreB =
        (gScore.get(bKey) ?? Number.POSITIVE_INFINITY) +
        manhattan(b, goal) +
        riskPenalty(grid, b);
      return scoreA - scoreB;
    });

    const current = open.shift() as Point;
    openSet.delete(keyOf(current));

    if (equalPoints(current, goal)) {
      const path = reconstructPath(cameFrom, keyOf(goal));
      return buildResult("utility-based", startTime, true, path, path, visitedOrder);
    }

    for (const next of neighbors(grid, current)) {
      const currentKey = keyOf(current);
      const nextKey = keyOf(next);
      const tentative =
        (gScore.get(currentKey) ?? Number.POSITIVE_INFINITY) + 1 + riskPenalty(grid, next);

      if (tentative < (gScore.get(nextKey) ?? Number.POSITIVE_INFINITY)) {
        cameFrom.set(nextKey, currentKey);
        gScore.set(nextKey, tentative);

        if (!openSet.has(nextKey)) {
          open.push(next);
          openSet.add(nextKey);
          visitedOrder.push(next);
        }
      }
    }
  }

  return buildResult(
    "utility-based",
    startTime,
    false,
    [start],
    [start],
    visitedOrder,
    undefined,
    "Utility search could not find a feasible route"
  );
}

export function runLearningAgent(grid: MazeGrid, start: Point, goal: Point): SimulationResult {
  const startTime = performance.now();
  const episodes = 220;
  const alpha = 0.2;
  const gamma = 0.9;
  let epsilon = 0.95;
  const epsilonMin = 0.05;
  const epsilonDecay = 0.985;

  const maxEpisodeSteps = grid.length * grid[0].length * 2;
  const qValues = new Map<string, number>();

  const actionVectors: Point[] = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  function actionKey(state: Point, actionIndex: number): string {
    return `${keyOf(state)}|${actionIndex}`;
  }

  function validActions(state: Point): number[] {
    const moves: number[] = [];
    for (let i = 0; i < actionVectors.length; i += 1) {
      const candidate = {
        row: state.row + actionVectors[i].row,
        col: state.col + actionVectors[i].col,
      };
      if (candidate.row < 0 || candidate.row >= grid.length) {
        continue;
      }
      if (candidate.col < 0 || candidate.col >= grid[0].length) {
        continue;
      }
      if (grid[candidate.row][candidate.col] === 1) {
        continue;
      }
      moves.push(i);
    }
    return moves;
  }

  function bestAction(state: Point, actions: number[]): number {
    let selected = actions[0];
    let selectedValue = qValues.get(actionKey(state, selected)) ?? 0;

    for (const action of actions.slice(1)) {
      const value = qValues.get(actionKey(state, action)) ?? 0;
      if (value > selectedValue) {
        selected = action;
        selectedValue = value;
      }
    }

    return selected;
  }

  for (let episode = 0; episode < episodes; episode += 1) {
    let state = { ...start };

    for (let step = 0; step < maxEpisodeSteps; step += 1) {
      if (equalPoints(state, goal)) {
        break;
      }

      const actions = validActions(state);
      if (!actions.length) {
        break;
      }

      const explore = Math.random() < epsilon;
      const action = explore
        ? actions[Math.floor(Math.random() * actions.length)]
        : bestAction(state, actions);

      const next = {
        row: state.row + actionVectors[action].row,
        col: state.col + actionVectors[action].col,
      };

      const reachedGoal = equalPoints(next, goal);
      const reward = reachedGoal ? 100 : -1 - riskPenalty(grid, next) * 0.1;

      const nextActions = validActions(next);
      const maxFuture = nextActions.length
        ? Math.max(...nextActions.map((idx) => qValues.get(actionKey(next, idx)) ?? 0))
        : 0;

      const currentQ = qValues.get(actionKey(state, action)) ?? 0;
      const updatedQ = currentQ + alpha * (reward + gamma * maxFuture - currentQ);
      qValues.set(actionKey(state, action), updatedQ);

      state = next;

      if (reachedGoal) {
        break;
      }
    }

    epsilon = Math.max(epsilonMin, epsilon * epsilonDecay);
  }

  const rolloutVisited: Point[] = [{ ...start }];
  const rolloutPath: Point[] = [{ ...start }];
  const seenRollout = new Set<string>([keyOf(start)]);
  const rolloutLimit = grid.length * grid[0].length * 2;
  let current = { ...start };

  for (let step = 0; step < rolloutLimit; step += 1) {
    if (equalPoints(current, goal)) {
      return buildResult(
        "learning",
        startTime,
        true,
        rolloutPath,
        rolloutPath,
        rolloutVisited,
        episodes
      );
    }

    const actions = validActions(current);
    if (!actions.length) {
      break;
    }

    const action = bestAction(current, actions);
    const next = {
      row: current.row + actionVectors[action].row,
      col: current.col + actionVectors[action].col,
    };

    current = next;
    rolloutPath.push({ ...current });
    rolloutVisited.push({ ...current });

    const currentKey = keyOf(current);
    if (seenRollout.has(currentKey)) {
      break;
    }
    seenRollout.add(currentKey);
  }

  return buildResult(
    "learning",
    startTime,
    false,
    rolloutPath,
    rolloutPath,
    rolloutVisited,
    episodes,
    "Policy did not converge to a complete route"
  );
}

export function runAgent(
  agent: AgentType,
  grid: MazeGrid,
  start: Point,
  goal: Point
): SimulationResult {
  switch (agent) {
    case "simple-reflex":
      return runSimpleReflex(grid, start, goal);
    case "model-based":
      return runModelBased(grid, start, goal);
    case "goal-based":
      return runGoalBased(grid, start, goal);
    case "utility-based":
      return runUtilityBased(grid, start, goal);
    case "learning":
      return runLearningAgent(grid, start, goal);
    default:
      return runGoalBased(grid, start, goal);
  }
}
