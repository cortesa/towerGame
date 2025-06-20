// General types
export type Position = { x: number; y: number };
export type Team = 'red' | 'blue' | 'green' | "magenta" | 'neutral';
export type BuildingLevel = 0 | 1 | 2 | 3;
export type TroopArrivalOutcome = "reinforced" | "defended" | "conquered";
export type BuildingType = "barrack" | "tower";

export interface PlayerState {
  name: string;
  team: Team;
  wins: number;
  losses: number;
  totalSoldiers: number;
  attackRatio: number;
}

export interface IPlayer {
	id: string;
	readState(): PlayerState;
	readState<K extends keyof PlayerState>(key: K): PlayerState[K];
	toJSON(): { id: string } & PlayerState;
	markWin(): void;
	markLoss(): void;
	setAttackRatio(ratio: number): void;
}

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
	level: BuildingLevel;
	soldierCount: number;
	team: Team;
	isUpgrading: boolean;
	canUpgrade: boolean;
	selected: boolean;
	isActive: boolean;
}

export interface TowerState extends BaseBuildingState {
	attackRange: number;
}

export interface IBuilding<State extends BaseBuildingState = BaseBuildingState> {
	id: string;
	buildingType: BuildingType;
	readState(): State;
	readState<K extends keyof State>(key: K): State[K];
	update(deltaTime: number, ...args: unknown[]): void;
	updateSoldierCount(soldierCount: number): void;
	select(team: Team): void;
	deselect(team: Team): void;
	toggleSelection(team: Team): void;
	startUpgrade(playerTeam: Team): void;
	onTroopArrival(attackingTeam: Team, attackingSoldiers: number): TroopArrivalOutcome;
}

export type TroopState = {
  team: Team;
  soldiers: number;
  position: Position;
};

export interface ITroop {
  id: string;
	readState(): TroopState;
	readState<K extends keyof TroopState>(key: K): TroopState[K];
	updateSoldierCount(soldierCount: number): void;
	update(deltaTime: number): { arrived: true; result: TroopArrivalOutcome } | { arrived: false };
	takeDamage(amount: number): void;
}

export interface ProjectileState {
	team: Team;
	position: Position;
}

export interface IProjectile {
  id: string;
	readState(): ProjectileState;
	readState<K extends keyof ProjectileState>(key: K): ProjectileState[K];
	update(deltaTime: number): boolean;
}

export interface BattleEvent {
  type: "troop_arrived";
  data: Record<string, unknown>;
}

export interface BattlefieldState {
  buildings: IBuilding[];
  troops: ITroop[];
  projectiles: IProjectile[];
  players: IPlayer[];
  soldiersPerTeam: { team: string; soldierCount: number }[];
}

export interface IBattlefield {
  id: string;
  readState(): BattlefieldState;
  readState<K extends keyof BattlefieldState>(key: K): BattlefieldState[K];
  update(deltaTime: number): BattleEvent[];
  addPlayer(player: IPlayer): void;
  deselectAllByPlayer(playerId: string): void;
  addBuilding(building: IBuilding): void;
  selectBuildingById(buildingId: string, playerId: string): void;
  sendTroops(fromId: string, toId: string, byPlayerId: string): void;
  getBuildingById(id: string): IBuilding | null;
}

