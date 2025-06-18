

// General types
export type Position = { x: number; y: number };
export type Team = 'red' | 'blue' | 'green' | "magenta" | 'neutral';
export type BuildingLevel = 0 | 1 | 2 | 3;
export type TroopArrivalOutcome = "reinforced" | "defended" | "conquered";
export type BuildingType = "barrack" | "tower";

// Base building state
export interface BuildingConfig {
	buildingType: BuildingType,
  x: number;
  y: number;
  team?: Team;
  initialSoldiers?: number;
  initialLevel?: BuildingLevel;
}

export interface BaseBuildingState {
	position: Position;
	level: number;
	soldierCount: number;
	team: Team;
	isUpgrading: boolean;
	canUpgrade: boolean;
	selected: boolean;
	isActive: boolean;
}