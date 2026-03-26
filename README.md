# 🤖 Types of AI Agents Visualizer

An interactive, visually stunning web application that demonstrates how five classic AI agent architectures navigate mazes differently. Watch **Simple Reflex**, **Model-Based**, **Goal-Based**, **Utility-Based**, and **Learning Agents** solve the same problem with fundamentally different decision-making strategies.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-06B6D4)

---

## ✨ Features

- 🎬 **Animated Loading Screen** — Smooth fade-in with glowing progress bar
- 🌌 **Dark Futuristic UI** — Neon cyan/violet accents, glassmorphism effects, smooth animations
- 🎮 **Interactive Maze Simulation** — Watch agents navigate a 2D grid in real-time
- 🧠 **5 AI Agent Types** — Each with unique decision-making logic and behavior patterns
- 📊 **Real-Time Metrics** — Track steps taken, execution time, success rate, and visited cells
- ⚡ **Speed Control** — Slow, medium, or fast animation playback
- 🔀 **Side-by-Side Comparison** — Compare two agents solving the same maze simultaneously
- 🎲 **Random Maze Generator** — Create infinite unique challenges with obstacles
- 📐 **Configurable Grid Sizes** — 8×8, 10×10, 12×12, 14×14 grids
- 📱 **Fully Responsive** — Works seamlessly on desktop and mobile devices
- ✨ **Smooth Animations** — Powered by Framer Motion for fluid transitions

---

## 🎯 Demo

Coming soon! Add screenshots/GIF demos:

```
[Screenshot 1: Loading Screen with animated Progress]
[Screenshot 2: Landing Page with Agent Cards and Descriptions]
[Screenshot 3: Visualization Page with Running Agent Simulation]
[Screenshot 4: Comparison Mode showing Two Agents Side-by-Side]
```

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** (App Router) | Full-stack React framework with SSR/CSR |
| **React 19** | Component-based UI with hooks |
| **TypeScript** | Type-safe JavaScript development |
| **Tailwind CSS** | Utility-first styling & dark theme design |
| **Framer Motion** | Smooth animations & interactive transitions |

---

## 📁 Project Structure

```
ai-agent-visualizer/
├── src/
│   ├── app/
│   │   ├── globals.css              # Dark theme, gradients, custom styles
│   │   ├── layout.tsx               # Root layout with custom fonts
│   │   ├── page.tsx                 # Landing page (loading + agent cards)
│   │   └── visualize/
│   │       └── page.tsx             # Main visualization (simulation controller)
│   │
│   ├── components/
│   │   ├── LoadingScreen.tsx        # Animated loading overlay (0-100%)
│   │   ├── AgentCard.tsx            # Agent description & info card
│   │   ├── ControlPanel.tsx         # Agent/speed/grid selection UI
│   │   ├── GridBoard.tsx            # 2D maze/grid renderer (memoized)
│   │   └── SimulationViewport.tsx   # Single agent viewport + metrics
│   │
│   └── lib/
│       └── agents/
│           ├── algorithms.ts        # ⭐ CORE: AI agent decision logic
│           ├── constants.ts         # Agent metadata & descriptions
│           ├── maze.ts              # Procedural maze generation
│           ├── types.ts             # TypeScript interfaces
│           ├── utils.ts             # Pathfinding helpers & utilities
│           └── index.ts             # Public API exports
│
├── public/                          # Static assets
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and npm scripts
```

---

## 🧠 Core Logic Explanation

### **⭐ The Brain of the Project**

This section explains where the intelligence lives, how it's structured, and how different parts communicate.

---

### 🔹 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                      │
│  (Landing Page, Agent Cards, Control Panel, Visualization)   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  SIMULATION CONTROLLER LAYER                 │
│    (State Management, Timing, Animation Sequencing)          │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│           AGENT DECISION-MAKING LAYER ⭐ (CORE)             │
│  Simple-Reflex, Model-Based, Goal-Based, Utility, Learning  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│               GRID & UTILITIES LAYER                         │
│    (Maze Generation, Pathfinding, Helper Functions)          │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      RENDERING LAYER                         │
│     (CSS Grid, Animations, Real-time Metrics Display)        │
└─────────────────────────────────────────────────────────────┘
```

**Flow Diagram:**

```
User Action (Select Agent)
    ↓
Simulation Controller gets maze + agent type
    ↓
Call runAgent(agentType, maze, start, goal) ← algorithms.ts
    ↓
Agent Algorithm Executes ← Decides moves
    ↓
Returns: { path, timeline, visited, metrics }
    ↓
Animation Controller starts frame-by-frame playback
    ↓
GridBoard Renders each frame with agent position
    ↓
SimulationViewport displays metrics in real-time
    ↓
Agent reaches goal → Animation stops
```

---

### 🔹 Code-Level Breakdown

#### 🎯 **Agent Decision Logic** — THE CORE INTELLIGENCE

**📍 Location:** `/src/lib/agents/algorithms.ts`

This file is the **heart of the project**. It contains the decision-making logic for all five AI agents. Each function runs the simulation and returns a complete walkthrough of the agent's path.

**Exported Functions:**

| Agent Type | Function | Description |
|-----------|----------|-------------|
| **Simple Reflex** | `runSimpleReflex()` | Greedy best-neighbor, no memory, may loop |
| **Model-Based** | `runModelBased()` | Tracks visited, backtracks, builds world model |
| **Goal-Based** | `runGoalBased()` | BFS pathfinding, optimal path, guaranteed success |
| **Utility-Based** | `runUtilityBased()` | A*-like scoring: distance + risk penalty |
| **Learning Agent** | `runLearningAgent()` | Q-learning over 220 episodes, policy improvement |
| **Master Export** | `runAgent()` | Dispatcher that calls the correct algorithm |

**Key Signature:**
```typescript
runAgent(
  agent: AgentType,
  grid: MazeGrid,
  start: Point,
  goal: Point
): SimulationResult
```

**Output Structure:**
```typescript
{
  agent: "goal-based",
  success: true,
  steps: 18,
  executionMs: 3.2,
  path: [{ row: 0, col: 0 }, ...],        // Final path taken
  timeline: [{ row: 0, col: 0 }, ...],    // Every position each step
  visited: [{ row: 0, col: 0 }, ...],     // All explored cells
  episodes: undefined,                     // Only for learning agent
  failureReason: undefined                 // If failed, why
}
```

**Algorithm Highlights:**

- **Simple Reflex** (~150 lines) — Immediate neighbor selection with random tie-breaking
- **Model-Based** (~100 lines) — Depth-first exploration with backtracking
- **Goal-Based** (~80 lines) — Classic BFS with parent tracking
- **Utility-Based** (~120 lines) — Modified A* with obstacle-proximity penalty
- **Learning Agent** (~200 lines) — Q-learning with ε-greedy exploration, then greedy rollout

---

#### 🗺️ **Grid & Pathfinding Utilities**

**📍 Location:** `/src/lib/agents/`

| File | Key Exports | Purpose |
|------|------------|---------|
| **maze.ts** | `generateMaze(size, density)`, `cloneMaze(grid)` | Random maze generation, grid cloning |
| **utils.ts** | `neighbors()`, `manhattan()`, `keyOf()`, `equalPoints()`, `inBounds()` | Grid navigation helpers, heuristics, point utilities |
| **types.ts** | `Point`, `MazeGrid`, `SimulationResult`, `AgentType` | Core TypeScript interfaces |
| **constants.ts** | `AGENTS[]` | Agent metadata (names, descriptions) |
| **index.ts** | Public API | Barrel export for clean imports |

**Critical Helper Functions:**

```typescript
// Get valid adjacent cells
neighbors(grid, point) → Point[]

// Manhattan distance heuristic (used by Goal-Based & Utility-Based)
manhattan(a, b) → number

// Convert point to string key for set lookups
keyOf(point) → "0,1"

// Check if point is inside grid bounds
inBounds(grid, point) → boolean

// Check if cell is walkable
isWalkable(grid, point) → boolean
```

---

#### 🎮 **Simulation Controller & State Management**

**📍 Location:** `/src/app/visualize/page.tsx` → `VisualizeContent()`

Orchestrates the entire simulation lifecycle:

**State Variables:**
```typescript
const [maze, setMaze]                              // 2D grid array
const [selectedAgent, setSelectedAgent]            // User's chosen AI
const [gridSize, setGridSize]                      // 8, 10, 12, or 14
const [frameIndex, setFrameIndex]                  // Current animation frame
const [primaryResult, secondaryResult]             // Simulation outputs
const [startTime, endTime, elapsedTimeMs]          // Animation timing
const [speedMs, setSpeedMs]                        // 90, 180, or 350 ms/frame
```

**Lifecycle Flow:**

```
1. User clicks "Run Simulation"
   ↓
2. clearRunningTimers() — Clean up old intervals
   ↓
3. Call runAgent() → Get path, timeline, metrics
   ↓
4. setStartTime(performance.now()) — Capture exact start
   ↓
5. Start elapsedTimer → Updates every 16ms
   ↓
6. Start animationTimer → Updates frameIndex every speedMs
   ↓
7. As frameIndex increases → GridBoard re-renders → Shows agent moving
   ↓
8. frameIndex reaches timeline length → Stop both timers
   ↓
9. setEndTime(performance.now()) → Calculate total elapsed
```

**Key Methods:**
- `runSimulation()` — Execute agent algorithm + start animation
- `resetSimulationState()` — Clear timers, reset frame index
- `regenerateMaze(size)` — Generate new grid + reset state
- `clearRunningTimers()` — Prevent stale intervals lingering

---

#### 🎨 **Grid Rendering — Memoized for Performance**

**📍 Location:** `/src/components/GridBoard.tsx`

Renders a **stable, unflickering 2D matrix**:

**Implementation Details:**

1. **Memoized Cell Computations:**
   ```typescript
   const visitedSet = useMemo(() => new Set(visited.map(keyOf)), [visited])
   const pathSet = useMemo(() => new Set(path.map(keyOf)), [path])
   const displayCells = useMemo(() => { /* Precompute all cell states */ }, [...deps])
   ```

2. **Stable Keys:**
   ```typescript
   // Bad (causes flicker):  key={`${rowIndex}${colIndex}`}
   // Good (stable):         key={`${row}-${col}`}
   ```

3. **CSS Grid Layout:**
   ```typescript
   style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
   ```

4. **Visual States:**
   - **Empty:** Dark zinc with light border
   - **Wall:** Dark gray
   - **Visited:** Cyan overlay (~20% opacity)
   - **Path:** Violet overlay (~30% opacity) with glow
   - **Start:** Green with emerald glow
   - **Goal:** Amber/yellow with bright glow
   - **Current Agent:** Fuchsia with pulse animation

---

#### 📊 **Metrics & Animation Viewport**

**📍 Location:** `/src/components/SimulationViewport.tsx`

Displays agent progress in real-time:

```
┌─ Agent Name
├─ Grid Display
│  ├─ Walls (dark)
│  ├─ Visited cells (cyan)
│  ├─ Path (violet)
│  ├─ Start (green)
│  ├─ Goal (amber)
│  └─ Current position (pulsing fuchsia)
│
└─ Metrics (6 cards)
   ├─ Status (Success/Failure)
   ├─ Animation Time (seconds)
   ├─ Compute Time (milliseconds)
   ├─ Steps Taken
   ├─ Cells Visited
   └─ Path Length
```

**Props:**
```typescript
interface SimulationViewportProps {
  grid: MazeGrid
  start: Point                   // Green cell
  goal: Point                    // Amber cell
  result: SimulationResult | null // From runAgent()
  frameIndex: number              // Current animation frame
  elapsedTimeMs: number           // Real-time elapsed
}
```

---

### 🔹 How All Pieces Communicate

```
┌─ User Interface (page.tsx, ControlPanel.tsx)
│  │
│  └─→ VisualizeContent() [State Management]
│      │
│      ├─→ runAgent() [algorithms.ts] ⭐ CORE
│      │   ↓
│      │   Uses: neighbors(), manhattan(), pathfinding helpers
│      │   Returns: { path: [], timeline: [], visited: [], ... }
│      │
│      ├─→ setFrameIndex() [Animation Loop]
│      │   ↓
│      │   Triggers re-render
│      │
│      ├─→ SimulationViewport.tsx [Display Layer]
│      │   │
│      │   └─→ GridBoard.tsx [Rendering]
│      │       Reads: grid, visited, path, current position
│      │       Uses: useMemo to prevent flicker
│      │       Renders: Memoized cell states
│      │
│      └─→ SimulationViewport.tsx [Metrics]
│          Displays: steps, time, success, visited count
```

---

## 🚀 How It Works

### User Journey

1. **Landing Page**
   - Loading screen animates (progress bar 0% → 100%)
   - Fade in 5 agent cards with descriptions
   - User reads about each agent

2. **Agent Selection**
   - Click "Visualize" on an agent card
   - OR use dropdown to select agent
   - Navigates to `/visualize?agent=goal-based`

3. **Simulation Setup**
   - Grid size selector (8, 10, 12, 14)
   - Speed selector (Slow, Medium, Fast)
   - Compare mode toggle (optional)

4. **Run Simulation**
   - Click "Run Simulation"
   - Agent algorithm executes (< 10ms)
   - Animation plays back step-by-step
   - Metrics update in real-time

5. **Explore Results**
   - See agent's path (violet cells)
   - See all visited nodes (cyan cells)
   - Check metrics: steps, time, success

6. **Iterate**
   - Click "Random Maze" for new obstacles
   - Change grid size for different challenges
   - Compare with another agent

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn**

### Step-by-Step

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/types-of-ai-agents.git
cd ai-agent-visualizer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build optimized version
npm run build

# Start production server
npm run start
```

---

## 💡 Usage Guide

### Running a Simulation

1. **Select Agent** — Dropdown or landing page card
2. **(Optional) Adjust Settings:**
   - Grid size: 8×8, 10×10, 12×12, 14×14
   - Speed: Slow (350ms), Medium (180ms), Fast (90ms)
3. **Click "Run Simulation"**
4. **Watch the animation** — Agent moves step-by-step
5. **View metrics** — Steps, time, success status

### Compare Two Agents

1. Enable "Compare Mode" checkbox
2. Select a second agent
3. Click "Run Simulation"
4. Both agents solve the same maze side-by-side
5. Compare their performance

### Custom Challenges

- Click "Random Maze" to generate new obstacles
- Agents re-solve the new layout
- Different maze = different challenge level

### Reset

- Click "Reset" to clear animation
- Keeps current maze and settings

---

## 🎓 Understanding Each Agent

### 🔴 **Simple Reflex Agent**

**Strategy:** "Pick the neighbor closest to the goal"

- Looks only at immediate neighbors (up, down, left, right)
- No memory of visited cells
- Greedy: always picks the option that decreases Manhattan distance

**Performance:**
- ⚡ Fast (few decisions)
- ❌ Often fails (gets stuck in local optima)
- 🔄 May loop infinitely

**When to Use:** Teaching local search strategies

---

### 🟠 **Model-Based Agent**

**Strategy:** "Explore everything, remember what you've seen"

- Tracks visited cells in memory
- Explores unvisited neighbors first
- Backtracks when stuck

**Performance:**
- ✅ Eventually finds the goal (if reachable)
- ⏱️ Slower than planned agents
- 💾 O(grid size) memory

**When to Use:** Incomplete information, exploration problems

---

### 🟡 **Goal-Based Agent (BFS)**

**Strategy:** "Find the shortest path before moving"

- Breadth-First Search to explore all options
- Computes complete path to goal
- Follows the path step-by-step

**Performance:**
- ✅ Guaranteed success if path exists
- ⚡ Shortest path (optimal)
- 🎯 Efficient, predictable

**When to Use:** Most standard problems, guaranteed completeness needed

---

### 🟢 **Utility-Based Agent (A*-like)**

**Strategy:** "Score options by distance + risk"

- Evaluates neighbors by utility function: `distance + risk`
- Risk = obstacles nearby (higher risk for tight spaces)
- Balances optimality with obstacle avoidance

**Performance:**
- ✅ Often faster than BFS
- ⚠️ Risk-aware (safer paths)
- 🔍 Good for robotics-style problems

**When to Use:** Real-world navigation, obstacle avoidance

---

### 🔵 **Learning Agent (Q-Learning)**

**Strategy:** "Learn the best actions through repeated trials"

- Q-learning: updates estimated values of state-action pairs
- Runs 220 training episodes (exploration + exploitation)
- Then uses learned policy for final run

**Performance:**
- 📈 Improves over time
- 🧠 Learns maze structure
- ⏱️ Slower at first, faster with practice

**When to Use:** Long-running systems, adaptive behavior needed

---

## 🔧 Configuration & Customization

### Grid Size Options

Edit `/src/components/ControlPanel.tsx`:
```typescript
{[8, 10, 12, 14].map((size) => (
  <option key={size} value={size}>{size} x {size}</option>
))}
```

### Maze Obstacle Density

Edit `/src/lib/agents/maze.ts`:
```typescript
export function generateMaze(size: number, density = 0.22): MazeGrid {
  // density: 0.0 (empty) to 1.0 (all obstacles)
  // Current: 22% obstacles
}
```

### Animation Speed Presets

Edit `/src/components/ControlPanel.tsx`:
```typescript
<option value={350}>Slow</option>     {/* 350ms per frame */}
<option value={180}>Medium</option>   {/* 180ms per frame */}
<option value={90}>Fast</option>      {/* 90ms per frame */}
```

### Learning Agent Parameters

Edit `/src/lib/agents/algorithms.ts` in `runLearningAgent()`:
```typescript
const episodes = 220;       // Training iterations (more = better)
const alpha = 0.2;          // Learning rate (0.0-1.0)
const gamma = 0.9;          // Discount factor (future importance)
let epsilon = 0.95;         // Initial exploration rate
const epsilonMin = 0.05;    // Minimum exploration
const epsilonDecay = 0.985; // Exponential decay
```

---

## 🎨 Design & Theme Customization

### Color Palette

Edit `/src/app/globals.css`:
```css
:root {
  --neon-cyan: #2de6ff;       /* Primary accent */
  --neon-violet: #a78bfa;     /* Secondary accent */
}
```

### Typography

Edit `/src/app/layout.tsx`:
```typescript
import { Orbitron, Space_Grotesk } from "next/font/google";
// Orbitron → Display (headings)
// Space Grotesk → Body (text)
```

### Grid Cell Size

Tailwind class in `GridBoard.tsx`:
```typescript
className="aspect-square h-full w-full rounded-[4px] ..."
// Adjust 'rounded-[4px]' for more/less rounded corners
// Adjust gap-1 in parent for cell spacing
```

---

## 🚧 Future Enhancements

- [ ] **3D Visualization** — Three-dimensional maze rendering
- [ ] **More Algorithms** — Dijkstra, Beam Search, Ant Colony Optimization
- [ ] **Multiplayer Mode** — Race multiple agents in real-time
- [ ] **Advanced RL** — Deep Q-Learning, Policy Gradients, Actor-Critic
- [ ] **Maze Creator** — Drag-and-drop custom obstacle placement
- [ ] **Sound Effects** — Subtle audio for agent movement, goal reached
- [ ] **Export Results** — Download performance charts as PDF/PNG
- [ ] **Theme Toggle** — Dark/Light mode with user preferences
- [ ] **Mobile UI** — Touch controls, responsive grid optimization
- [ ] **Benchmark Mode** — Compare algorithms on standardized mazes

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's the workflow:

### Steps

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/types-of-ai-agents.git
   ```
3. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make** your changes
5. **Commit** with clear messages:
   ```bash
   git commit -m "Add new feature: description"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** with description of changes

### Development Standards

- ✅ Run `npm run lint` before committing
- ✅ Ensure `npm run build` succeeds
- ✅ Keep TypeScript strict mode enabled
- ✅ Add comments for complex algorithms
- ✅ Test on multiple grid sizes

---

## 📝 License

This project is licensed under the **MIT License** — you're free to use it for educational, commercial, or personal projects.

---

## 🙋 FAQ

**Q: Why does Simple Reflex sometimes get stuck?**
A: It only looks at neighbors and picks greedily. Without memory or search lookahead, it can enter cycles (e.g., oscillating between two cells).

**Q: How accurate is the timing?**
A: Animation time uses `performance.now()` (microsecond precision). Compute time is algorithm execution (typically < 5ms). Both are accurate.

**Q: Can I add my own agent?**
A: Yes! Add a new function to `/src/lib/agents/algorithms.ts`, export it via `runAgent()`, and add metadata to `constants.ts`.

**Q: Why CSS Grid instead of Canvas?**
A: CSS Grid is simpler, more accessible, DOM-integrated, and perfect for this grid-based visualization. Canvas would be overkill.

**Q: How does Learning Agent work exactly?**
A: Uses Q-learning, a Reinforcement Learning technique. Over 220 episodes, it updates Q-values (expected utility of state-action pairs). Higher Q-values = better. Finally, it follows the learned policy greedily.

**Q: Can I change the maze size dynamically?**
A: Yes! The grid size dropdown regenerates a new maze instantly. All agents will navigate the new layout.


---

**Made with ❤️ by Aryan27-max**

⭐ If you find this useful, please consider giving it a star on GitHub!

