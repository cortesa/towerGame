import { Building } from "./building";
import { TOWER_ATTACK_COOLDOWN, TOWER_ATTACK_RANGE } from "./constants";
import type { Troop } from "./troop";
import type { Position, BuildingLevel, BuildingConfig, BaseBuildingState, IBuilding, TowerState } from "./types";
import { Projectile } from "./projectile";



/**
 * Represents a Tower building that can attack enemy troops within range.
 */
export class Tower extends Building<TowerState> implements IBuilding<TowerState> {
	private attackCooldownTime: number = 0;
	private closestTroopInRange: Troop | null = null;
	public onProjectileCreated?: (projectile: Projectile) => void;

	/**
	 * Creates a new Tower instance.
	 * @param config - The configuration for the building.
	 */
	constructor(config: BuildingConfig) {
		super("tower", config)
		this.setState({
			attackRange: TOWER_ATTACK_RANGE[this.readState("level") as BuildingLevel]
		})
	}
	
	private distanceTo(pos: Position): number {
		const position = this.readState("position")
		const dx = pos.x - position.x;
		const dy = pos.y - position.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	private findClosestTroopInRange(troops: Troop[]): Troop | null {
		const { team, attackRange } = this.readState();
		let closest: Troop | null = null;
		let minDistance = Infinity;

		for (const troop of troops) {
			const state = troop.readState();
			if (state.team === team || state.soldiers <= 0) continue;

			const distance = this.distanceTo(state.position);
			if (distance <= attackRange && distance < minDistance) {
				closest = troop;
				minDistance = distance;
			}
		}

		return closest;
	}

	/**
	 * Updates the tower state each frame, checking for troops in range and updating cooldown.
	 * @param deltaTime (s) - Time elapsed since the last update.
	 * @param troops - Array of troops to check for targets.
	 */
	protected onUpdate(deltaTime: number, troops: Troop[]): void {
		this.attackCooldownTime = Math.max(0, this.attackCooldownTime - deltaTime);

		this.closestTroopInRange = this.findClosestTroopInRange(troops);
		this.setState({ isActive: this.closestTroopInRange !== null });
	}

	/**
	 * Handles logic when the tower is upgraded, updating its attack range.
	 */
	protected onUpgrade(): void {
		this.setState({
			attackRange: TOWER_ATTACK_RANGE[this.readState("level")]
		})
	}
	
	/**
	 * Handles logic when the tower is conquered, updating its attack range.
	 */
	protected onConquered(): void {
		this.setState({
			attackRange: TOWER_ATTACK_RANGE[this.readState("level")]
		})
	}

	/**
	 * Performs the tower's attack action if cooldown has elapsed and a target is available.
	 */
	public buildingAction(): void {
		if (this.attackCooldownTime > 0 || !this.closestTroopInRange) return;

		if (this.onProjectileCreated) {
			const to = this.closestTroopInRange;
			const team = this.readState("team");
			this.onProjectileCreated(new Projectile(this, to, team));
		}

		this.attackCooldownTime = TOWER_ATTACK_COOLDOWN[this.readState("level")];
	}
}
