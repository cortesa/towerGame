import { BUILDING_UPGRADE_THRESHOLDS, TOWER_ATTACK_COOLDOWN_BY_LEVEL, TOWER_ATTACK_RANGES_BY_LEVEL, UPGRADE_COOLDOWN_TICKS } from "./constants";
import type { Troop } from "./troop";
import type { Position, Team, BuildingLevel } from "./types";



// NOTE: Position, Team, and Troop types are assumed to be imported or defined globally elsewhere.

export type TowerState = {
	position: Position;
	level: BuildingLevel;
	soldierCount: number;
	team: Team;
	isUpgrading: boolean;
	canUpgrade: boolean;
	cooldown: number;
	selected: boolean;
};

export interface BarrackConfig {
	x: number;
	y: number;
	team?: Team;
	initialSoldiers?: number;
	initialLevel?: BuildingLevel;
}


export class Tower {
	public readonly id: string;
	private state: TowerState;
	private readonly position: Position;
	private tickCounter = 0;
  private upgradeCooldownTicks = UPGRADE_COOLDOWN_TICKS;

	constructor(config: BarrackConfig) {
		this.id = crypto.randomUUID();
		const initialSoldiers = config.initialSoldiers ?? 0;
		const level = this.calculateLevelFromSoldiers(initialSoldiers, config.initialLevel);
		this.position = { x: config.x, y: config.y };
		this.state = {
			position: this.position,
			level,
			team: config.team ?? "neutral",
			isUpgrading: false,
			canUpgrade: false,
			cooldown: 0,
			soldierCount: initialSoldiers,
			selected: false,
		};
	}

	private calculateLevelFromSoldiers(soldiers: number, fallbackLevel?: BuildingLevel): BuildingLevel {
		const thresholds = Object.entries(BUILDING_UPGRADE_THRESHOLDS)
			.map(([level, value]) => [Number(level) as BuildingLevel, value] as [BuildingLevel, number])
			.sort((a, b) => a[0] - b[0]);

		let resolvedLevel: BuildingLevel = fallbackLevel ?? 0;
		for (const [level, threshold] of thresholds) {
			if (soldiers >= threshold) {
				resolvedLevel = (level + 1) as BuildingLevel;
			}
		}
		return Math.min(resolvedLevel, 3) as BuildingLevel;
	}

	public readState(): TowerState;
	public readState<K extends keyof TowerState>(key: K): TowerState[K];
	public readState<K extends keyof TowerState>(key?: K) {
		return key ? this.state[key] : { ...this.state };
	}

	private setState(patch: Partial<TowerState>) {
		Object.assign(this.state, patch);
	}

	private distanceTo(pos: Position): number {
		const dx = pos.x - this.position.x;
		const dy = pos.y - this.position.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	public canUpgrade(soldiers: number): boolean {
		const level = this.readState("level");
		return soldiers >= BUILDING_UPGRADE_THRESHOLDS[level];
	}

	  private isSelectableBy(team: Team): boolean {
    return this.state.team !== 'neutral' && this.state.team === team;
  }

	public startUpgrade(playerTeam: Team) {
		if (!this.isSelectableBy(playerTeam)) return;
		const level = this.readState("level");
		const canUpgrade = this.readState('canUpgrade');
		const nextLevel = (level + 1) as BuildingLevel;

		if (!canUpgrade || nextLevel > 3) return;

		this.setState({
			soldierCount: this.readState('soldierCount') - BUILDING_UPGRADE_THRESHOLDS[level],
			isUpgrading: true,
			canUpgrade: false,
		});
		this.upgradeCooldownTicks = UPGRADE_COOLDOWN_TICKS;
	}

	public update(deltaTime: number, troops: Troop[]) {

		// const isUpgrading = this.readState('isUpgrading');

		const cooldown = Math.max(0, this.readState("cooldown") - deltaTime);
		this.setState({ cooldown });

		const range = TOWER_ATTACK_RANGES_BY_LEVEL[this.readState("level")];
		const team = this.readState("team");

		const enemies = troops.filter(
			(t) => {
				const state = t.readState();
				return state.team !== team && this.distanceTo(state.position) <= range && state.soldiers > 0;
			}
		);
		const closest = enemies.reduce((closest, current) => {
			const d = this.distanceTo(current.readState("position"));
			return d < this.distanceTo(closest.readState("position")) ? current : closest;
		});

		this.fireAt(closest);
		this.setState({ cooldown: TOWER_ATTACK_COOLDOWN_BY_LEVEL[this.readState("level")] });
	}

	private fireAt(target: Troop) {
		target.takeDamage(1);
	}

	public applyAttack(attackingTeam: Team, attackingSoldiers: number): "reinforced" | "conquered" | "defended" {
		const currentTeam = this.readState("team");
		const currentSoldiers = this.readState("soldierCount");
	
		if (currentTeam === attackingTeam) {
			this.setState({ soldierCount: currentSoldiers + attackingSoldiers });
			return "reinforced";
		}
	
		const survivors = currentSoldiers - attackingSoldiers;
	
		if (survivors >= 0) {
			this.setState({ soldierCount: survivors });
		} else {
			this.setState({
				team: attackingTeam,
				soldierCount: Math.abs(survivors),
				level: 0,
				isUpgrading: false,
				canUpgrade: false,
			});
			return "conquered";
		}
	
		this.setState({
			isUpgrading: false,
			canUpgrade: false,
		});
		return "defended";
	}


  public select(playerTeam: Team) {
    if (!this.isSelectableBy(playerTeam)) return;
    this.setState({ selected: true });
  }

  public deselect(playerTeam: Team) {
    if (!this.isSelectableBy(playerTeam)) return;
    this.setState({ selected: false });
  }

  public toggleSelection(playerTeam: Team) {
    if (!this.isSelectableBy(playerTeam)) return;
    this.setState({ selected: !this.state.selected });
  }
}
