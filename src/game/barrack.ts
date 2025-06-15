type Level = 0 | 1 | 2 | 3;

export type BarrackState = {
  position: { x: number; y: number };
  level: Level;
  soldierCount: number;
  team: Team;
  isUpgrading: boolean;
  canUpgrade: boolean;
  selected: boolean;
};

export type Team = 'red' | 'blue' | 'green' | "magenta" | 'neutral';

export interface BarrackConfig {
  x: number;
  y: number;
  team?: Team;
  initialSoldiers?: number;
  initialLevel?: Level;
}

export type AttackResult = "reinforced" | "defended" | "conquered";

const MAX_SOLDIERS = 64;
const UPGRADE_COOLDOWN_TICKS = 300;

const LEVEL_THRESHOLDS: Record<Level, number> = {
  0: 5,
  1: 35,
  2: 40,
  3: Infinity, // no upgrade past level 3
};

const LEVEL_CONSUMPTION: Record<Level, number> = {
  0: 0,
  1: 5,
  2: 35,
  3: 40,
};

const LEVEL_PRODUCTION_SPEED: Record<Level, number> = {
  0: 120, // ticks per soldier (slowest)
  1: 60,
  2: 30,
  3: 10,  // fastest
};

export class Barrack {
  public readonly id: string;
  private state: BarrackState;
  private tickCounter = 0;
  private upgradeCooldownTicks = UPGRADE_COOLDOWN_TICKS;

  constructor(config: BarrackConfig) {
    this.id = crypto.randomUUID();
    const initialSoldiers = config.initialSoldiers ?? 0;
    const level = this.calculateLevelFromSoldiers(initialSoldiers, config.initialLevel);
    this.state = {
      position: { x: config.x, y: config.y },
      level,
      soldierCount: initialSoldiers,
      team: config.team ?? 'neutral',
      isUpgrading: false,
      canUpgrade: false,
      selected: false,
    };
  }

  private calculateLevelFromSoldiers(soldiers: number, fallbackLevel?: Level): Level {
    const thresholds = Object.entries(LEVEL_THRESHOLDS)
      .map(([level, value]) => [Number(level) as Level, value] as [Level, number])
      .sort((a, b) => a[0] - b[0]);

    let resolvedLevel: Level = fallbackLevel ?? 0;
    for (const [level, threshold] of thresholds) {
      if (soldiers >= threshold) {
        resolvedLevel = level + 1;
      }
    }
    return Math.min(resolvedLevel, 3) as Level;
  }

  public readState(): BarrackState;
  public readState<K extends keyof BarrackState>(key: K): BarrackState[K];
  public readState<K extends keyof BarrackState>(key?: K) {
    return key ? this.state[key] : { ...this.state };
  }

  private setState(patch: Partial<BarrackState>) {
    Object.assign(this.state, patch);
  }

  private evaluateUpgradeOption() {
    if (this.readState('team') === 'neutral') {
      this.setState({ canUpgrade: false });
      return;
    }

    const nextLevel = (this.readState('level') + 1) as Level;
    if (nextLevel > 3) {
      this.setState({ canUpgrade: false });
      return;
    }

    const threshold = LEVEL_THRESHOLDS[this.readState('level')];
    this.setState({
      canUpgrade: this.readState('soldierCount') >= threshold,
    });
  }
  
  public update() {
    const isUpgrading = this.readState('isUpgrading');

    if (isUpgrading) {
      if (this.upgradeCooldownTicks > 0) {
        this.upgradeCooldownTicks--;
        return;
      } else {
        const nextLevel = (this.readState('level') + 1) as Level;
        this.setState({
          level: nextLevel,
          isUpgrading: false,
        });
      }
    }

    if (this.readState('team') === 'neutral') return;

    this.tickCounter++;

    if (this.tickCounter >= LEVEL_PRODUCTION_SPEED[this.readState('level')]) {
      this.tickCounter = 0;
      if (this.readState('soldierCount') < MAX_SOLDIERS) {
        this.setState({
          soldierCount: this.readState('soldierCount') + 1,
        });
      }
    }

    this.evaluateUpgradeOption();
  }

  public toJSON(): BarrackState {
    // Return a shallow copy of the internal state
    return { ...this.state };
  }

  public updateSoldierCount(amount: number) {
    if (this.readState('team') === 'neutral') return;
    const newCount = Math.max(0, this.readState('soldierCount') - amount);
    this.setState({ soldierCount: newCount });
  }

  private isSelectableBy(team: Team): boolean {
    return this.state.team !== 'neutral' && this.state.team === team;
  }

  public startUpgrade(playerTeam: Team) {
    if (!this.isSelectableBy(playerTeam)) return;
    const level = this.readState('level');
    const canUpgrade = this.readState('canUpgrade');
    const nextLevel = (level + 1) as Level;

    if (!canUpgrade || nextLevel > 3) return;

    this.setState({
      soldierCount: this.readState('soldierCount') - LEVEL_CONSUMPTION[nextLevel],
      isUpgrading: true,
      canUpgrade: false,
    });
    this.upgradeCooldownTicks = UPGRADE_COOLDOWN_TICKS;
  }

  public applyAttack(attackingTeam: Team, attackingSoldiers: number): AttackResult {
	const currentTeam = this.readState('team');
	const currentSoldiers = this.readState('soldierCount');

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
		});
		this.tickCounter = 0;
		this.setState({
			canUpgrade: false,
			isUpgrading: false,
		});
		this.upgradeCooldownTicks = UPGRADE_COOLDOWN_TICKS;
		return "conquered";
	}

	this.setState({
		canUpgrade: false,
		isUpgrading: false,
	});
	this.upgradeCooldownTicks = UPGRADE_COOLDOWN_TICKS;

	return "defended";
  }

  public resetWithTeam(newTeam: Team) {
    this.setState({
      team: newTeam,
      soldierCount: 0,
      level: 0,
    });
    this.tickCounter = 0;
  }

  public getPosition(): { x: number; y: number } {
    return this.state.position;
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
