import type { BaseBuildingState, BuildingType, Team, TroopArrivalOutcome, BuildingConfig, BuildingLevel } from "./types";
import { calculateLevelFromSoldiers, evaluateUpgradeOption } from "./utils";
import { BUILDING_UPGRADE_THRESHOLDS, UPGRADE_COOLDOWN_TICKS } from "./constants";

export abstract class Building<BuildingState extends BaseBuildingState> {
	public readonly id: string;
	public readonly buildingType: BuildingType;
	private state: BuildingState;
	private upgradeCooldownTicks: number

	/**
	 * Abstract method representing the main action of the building.
	 * Subclasses must implement this to define their specific behavior.
	 */
	public abstract buildingAction(...args: unknown[]): void;

	/**
	 * Abstract method called during update lifecycle.
	 * Subclasses should implement this to update internal state or perform periodic checks.
	 */
	protected onUpdate?(...args: unknown[]): void;

	/**
	 * Optional hook called when the building is conquered by an enemy team.
	 * Subclasses can override this to implement custom behavior on conquest.
	 */
	protected onConquered?(): void;

	/**
	 * Optional hook called when the building successfully defends against an attack.
	 * Subclasses can override this to implement custom behavior on defense.
	 */
	protected onDefended?(): void;

	/**
	 * Optional hook called when the building is reinforced by allied troops.
	 * Subclasses can override this to implement custom behavior on reinforcement.
	 */
	protected onReinforced?(): void;

	constructor(buildingType: BuildingType, config: BuildingConfig) {
		this.id = crypto.randomUUID();
		this.buildingType = buildingType;
		this.upgradeCooldownTicks = UPGRADE_COOLDOWN_TICKS
		const initialSoldiers = config.initialSoldiers ?? 0;
    const level = calculateLevelFromSoldiers(initialSoldiers, config.initialLevel);
		this.state = {
			position: { x: config.x, y: config.y },
			level,
			soldierCount: initialSoldiers,
			team: config.team ?? 'neutral',
			isUpgrading: false,
			canUpgrade: false,
			selected: false,
			isActive: false,
		} as BuildingState;
	}

	/**
	 * Final method. Should not be overridden in subclasses.
	 * Handles the building update lifecycle by calling `onUpdate` and conditionally `buildingAction`.
	 */
	public update(...args: unknown[]): void {
		const level = this.readState("level")
		this.onUpdate?.(...args);
		evaluateUpgradeOption(
			this.readState(), 
			(patch: Partial<BaseBuildingState>) => this.setState(patch as Partial<BuildingState>)
		)

		if(this.readState("isUpgrading")) {
			 if (this.upgradeCooldownTicks > 0) {
        this.upgradeCooldownTicks--;
        return;
      } else {
      	const nextLevel = (this.readState('level') + 1) as BuildingLevel;
				this.setState({
		  		level: nextLevel,
		  		isUpgrading: false,
					canUpgrade: false,
				} as Partial<BuildingState>);
      }
		}

		if (this.readState("isActive")) {
			this.buildingAction(level, ...args);
		}
	}

	/**
	 * Reads the current state or a specific property of the building's state.
	 * @param key Optional key of the state property to read.
	 * @returns The entire state or the value of the specified property.
	 */
	public readState(): BuildingState;
	public readState<K extends keyof BuildingState>(key: K): BuildingState[K];
	public readState<K extends keyof BuildingState>(key?: K) {
		return key ? this.state[key] : { ...this.state };
	}

	/**
	 * Updates the building's state with the provided partial state.
	 * Protected to restrict direct external modification.
	 * @param patch Partial state to merge into current state.
	 */
	protected setState(patch: Partial<BuildingState>) {
		Object.assign(this.state, patch);
	}

	/**
	 * Determines if the building can be selected by the given team.
	 * @param team Team attempting selection.
	 * @returns True if selectable by the team, false otherwise.
	 */
	protected isSelectableBy(team: Team): boolean {
		return this.state.team !== "neutral" && this.state.team === team;
	}

	/**
	 * Selects the building if the team is allowed to do so.
	 * @param team Team attempting selection.
	 */
	public select(team: Team) {
		if (!this.isSelectableBy(team)) return;
		this.setState({ selected: true } as Partial<BuildingState>);
	}

	/**
	 * Deselects the building if the team is allowed to do so.
	 * @param team Team attempting deselection.
	 */
	public deselect(team: Team) {
		if (!this.isSelectableBy(team)) return;
		this.setState({ selected: false } as Partial<BuildingState>);
	}

	/**
	 * Toggles the selection state of the building if the team is allowed to do so.
	 * @param team Team attempting to toggle selection.
	 */
	public toggleSelection(team: Team) {
		if (!this.isSelectableBy(team)) return;
		this.setState({ selected: !this.readState("selected") } as Partial<BuildingState>);
	}

	/**
	 * Initiates the upgrade process if the building belongs to the given team and meets the requirements.
	 * Deducts the soldier cost and sets the building as upgrading.
	 * @param playerTeam The team attempting to upgrade this building.
	 */
	 public startUpgrade(playerTeam: Team) {
    if (!this.isSelectableBy(playerTeam)) return;
    const level = this.readState('level');
    const canUpgrade = this.readState('canUpgrade');

    if (!canUpgrade || level === 3) return;
		
		this.setState({
		  soldierCount: this.readState('soldierCount') - BUILDING_UPGRADE_THRESHOLDS[level],
		  isUpgrading: true,
		  canUpgrade: false,
		} as Partial<BuildingState>);

    this.upgradeCooldownTicks = UPGRADE_COOLDOWN_TICKS
  }

	/**
	 * Handles the arrival of attacking troops at the building.
	 * Updates state based on attack outcome and triggers corresponding hooks.
	 * @param attackingTeam The team of the attacking troops.
	 * @param attackingSoldiers Number of attacking soldiers.
	 * @returns Outcome of the troop arrival: "reinforced", "defended", or "conquered".
	 */
	public onTroopArrival(attackingTeam: Team, attackingSoldiers: number): TroopArrivalOutcome {
		const currentTeam = this.readState("team");
		const currentSoldiers = this.readState("soldierCount");

		if (currentTeam === attackingTeam) {
			this.setState({ soldierCount: currentSoldiers + attackingSoldiers } as Partial<BuildingState>);
			this.onReinforced?.();
			return "reinforced";
		}

		const survivors = currentSoldiers - attackingSoldiers;

		if (survivors >= 0) {
			this.setState({ soldierCount: survivors } as Partial<BuildingState>);
			this.onDefended?.();
		} else {
			this.setState({
				team: attackingTeam,
				soldierCount: Math.abs(survivors),
				level: 0,
				isUpgrading: false,
				canUpgrade: false,
			} as Partial<BuildingState>);
			this.onConquered?.();
			return "conquered";
		}

		return "defended";
	}
}