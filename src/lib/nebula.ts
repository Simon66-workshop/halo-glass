import type { SceneTone } from "./halo";

export type NebulaLook = {
  id: string;
  name: string;
  note: string;
  tone: SceneTone;
  sky: [number, number, number];
  dark: [number, number, number];
  mid: [number, number, number];
  hot: [number, number, number];
  density: number;
  swirl: number;
  stars: number;
  planet: number;
};

export const NEBULA_LOOKS: NebulaLook[] = [
  {
    id: "veil",
    name: "Veil",
    note: "Teal + violet drift",
    tone: "dark",
    sky: [0.02, 0.03, 0.08],
    dark: [0.16, 0.06, 0.36],
    mid: [0.22, 0.52, 0.95],
    hot: [0.82, 0.42, 1.0],
    density: 1.05,
    swirl: 0.85,
    stars: 1,
    planet: 1,
  },
  {
    id: "magenta",
    name: "Magenta",
    note: "Warm pillars",
    tone: "dark",
    sky: [0.05, 0.01, 0.06],
    dark: [0.38, 0.04, 0.22],
    mid: [0.9, 0.22, 0.55],
    hot: [1.0, 0.68, 0.88],
    density: 1.12,
    swirl: 1.05,
    stars: 0.85,
    planet: 1,
  },
  {
    id: "ember",
    name: "Ember",
    note: "Burning dust",
    tone: "dark",
    sky: [0.05, 0.02, 0.02],
    dark: [0.32, 0.07, 0.03],
    mid: [0.92, 0.34, 0.1],
    hot: [1.0, 0.78, 0.38],
    density: 1.0,
    swirl: 0.7,
    stars: 0.7,
    planet: 1,
  },
  {
    id: "ion",
    name: "Ion",
    note: "Electric cyan",
    tone: "dark",
    sky: [0.01, 0.05, 0.07],
    dark: [0.02, 0.22, 0.3],
    mid: [0.08, 0.82, 0.78],
    hot: [0.72, 1.0, 0.94],
    density: 1.08,
    swirl: 1.15,
    stars: 1.15,
    planet: 1,
  },
  {
    id: "dawn",
    name: "Dawn",
    note: "High-key cirrus",
    tone: "light",
    sky: [0.93, 0.9, 0.84],
    dark: [0.7, 0.8, 0.9],
    mid: [0.86, 0.91, 0.96],
    hot: [1.0, 0.96, 0.88],
    density: 0.82,
    swirl: 0.45,
    stars: 0.25,
    planet: 1,
  },
];

export const DEFAULT_LOOK = NEBULA_LOOKS[0];
