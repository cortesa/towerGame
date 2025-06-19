import type { BuildingConfig, BuildingLevel } from "./types";

export const MAX_SOLDIERS_PRODUCTION = 64; //soldiers
export const TROOP_SPEED = 60; // in px/second
export const UPGRADE_COOLDOWN_TIME = 5; // in seconds

export const BUILDING_UPGRADE_THRESHOLDS: Record<BuildingLevel, number> = {
	0: 5,
	1: 35,
	2: 40,
	3: Infinity,
};

export const SOLDIERS_PRODUCTION_COOLDOWN: Record<BuildingLevel, number> = {
  0: 2.5, // seconds per soldier (slowest)
  1: 2,
  2: 1.5,
  3: 1,  // fastest
};

export const TOWER_ATTACK_RANGE: Record<BuildingLevel, number> = {
	0: 90, // pixels
	1: 120,
	2: 160,
	3: 210,
};

export const TOWER_ATTACK_COOLDOWN: Record<BuildingLevel, number> = {
	0: 2.8, // seconds
	1: 2.5,
	2: 1.7,
	3: 1.1,
};

//---------------------------------------------------------------------------------------------------
// vvvvvvvvvvvvvvvvvv  -- THIS SHOULD BE IN OTHER PLACED BUT GOOD HERE FOR NOW --  vvvvvvvvvvvvvvvvvv
//---------------------------------------------------------------------------------------------------
export const INITIAL_BARRACKS: BuildingConfig[] = [
	{ buildingType:"barrack", x: 250, y: 250, initialSoldiers: 5, team: "neutral" },
	{ buildingType:"barrack", x: 100, y: 450, initialSoldiers: 50, team: "blue" },
	{ buildingType:"barrack", x: 380, y: 100, initialSoldiers: 5, team: "red" },
	{ buildingType:"barrack", x: 50, y: 50, initialSoldiers: 2, team: "green" },
];

export const INITIAL_TOWERS: BuildingConfig[] = [
	{ buildingType:"tower", x: 100, y: 250, initialSoldiers: 5, team: "neutral" },
	{ buildingType:"tower", x: 170, y: 380, initialSoldiers: 50, team: "blue" },
	{ buildingType:"tower", x: 300, y: 50, initialSoldiers: 5, team: "red" },
	{ buildingType:"tower", x: 120, y: 120, initialSoldiers: 2, team: "green" },
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