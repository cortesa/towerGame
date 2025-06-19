import { Building } from "./building";
import { TOWER_ATTACK_COOLDOWN, TOWER_ATTACK_RANGE } from "./constants";
import type { Troop } from "./troop";
import type { Position, BuildingLevel, BuildingConfig, BaseBuildingState } from "./types";

interface TowerState extends BaseBuildingState {
	attackRange: number;
}

export class Tower extends Building<TowerState> {
	private attackCooldownTime: number = 0;
	private closestTroopInRange: Troop | null = null;

	constructor(config: BuildingConfig) {
		super("tower", config)
		this.setState({
			attackRange: TOWER_ATTACK_RANGE[this.readState("level") as BuildingLevel]
		})
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

	protected onUpdate(deltaTime: number, troops: Troop[]): void {
    this.attackCooldownTime = Math.max(0, this.attackCooldownTime - deltaTime);

		this.closestTroopInRange = this.findClosestTroopInRange(troops);
		this.setState({ isActive: this.closestTroopInRange !== null });
  }


	private distanceTo(pos: Position): number {
		const position = this.readState("position")
		const dx = pos.x - position.x;
		const dy = pos.y - position.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	public buildingAction(): void {
		if (this.attackCooldownTime > 0 || !this.closestTroopInRange) return;

		this.closestTroopInRange.takeDamage(1);
		this.attackCooldownTime = TOWER_ATTACK_COOLDOWN[this.readState("level")];
	}
}
