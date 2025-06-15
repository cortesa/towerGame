import type { BarrackConfig } from "./barrack";

export const INITIAL_BARRACKS: BarrackConfig[] = [
	{ x: 50, y: 200, initialSoldiers: 5, team: "neutral" },
	{ x: 100, y: 150, initialSoldiers: 50, team: "blue" },
	{ x: 30, y: 50, initialSoldiers: 5, team: "red" },
	{ x: 170, y: 30, initialSoldiers: 2, team: "green" },
];
// export const INITIAL_BARRACKS: BarrackConfig[] = [
// 	{ x: 50, y: 200, initialSoldiers: 5, team: "neutral" },
// 	{ x: 150, y: 300, initialSoldiers: 35, team: "neutral" },
// 	{ x: 175, y: 500, initialSoldiers: 40, team: "neutral" },
// 	{ x: 100, y: 150, initialSoldiers: 5, team: "blue" },
// 	{ x: 30, y: 50, initialSoldiers: 5, team: "blue" },
// 	{ x: 150, y: 400, initialSoldiers: 10, team: "red" },
// 	{ x: 70, y: 450, initialSoldiers: 35, team: "magenta" },
// 	{ x: 170, y: 30, initialSoldiers: 50, team: "green" },
// ];