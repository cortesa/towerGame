import { PROJECTILE_SPEED } from "./constants";
import type { IBuilding, IProjectile, ITroop, ProjectileState, Team, TowerState } from "./types";

export class Projectile implements IProjectile {
	public readonly id: string;
	private originTower: IBuilding<TowerState>;
	private targetTroop: ITroop;
	private state: ProjectileState;
	private readonly maxDistance: number

	constructor(originTower: IBuilding<TowerState>, targetTroop: ITroop, team: Team) {
		this.id = crypto.randomUUID();
		this.originTower = originTower;
		this.targetTroop = targetTroop;
		this.maxDistance = originTower.readState("attackRange")* 1.10;
		this.state = {
			team,
			position: { ...originTower.readState().position }
		};
	}

	public readState(): ProjectileState;
	public readState<K extends keyof ProjectileState>(key: K): ProjectileState[K];
	public readState<K extends keyof ProjectileState>(key?: K) {
		return key ? this.state[key] : { ...this.state };
	}

	private setState(patch: Partial<ProjectileState>) {
		Object.assign(this.state, patch);
	}

	/**
	 * Updates the projectile's position based on elapsed time.
	 * @param deltaTime - (s) The time elapsed since the last update call.
	 * @returns True if the projectile has reached the target.
	 */
	public update(deltaTime: number): boolean {
		const from = this.originTower.readState("position");
		const to = this.targetTroop.readState("position");

		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance === 0) {
			this.setState({ position: { ...to } });
			return true;
		}

		const directionX = dx / distance;
		const directionY = dy / distance;

		const moveDistance = (PROJECTILE_SPEED * deltaTime);
		const current = this.readState("position");

		const newX = current.x + directionX * moveDistance;
		const newY = current.y + directionY * moveDistance;

		const nextDx = to.x - newX;
		const nextDy = to.y - newY;
		const remainingDistance = Math.sqrt(nextDx * nextDx + nextDy * nextDy);

		if (remainingDistance <= moveDistance) {
			this.setState({ position: { ...to } });
			this.targetTroop.takeDamage(1);
			return true;
		}

		this.setState({ position: { x: newX, y: newY } });


		const dxFromOrigin = newX - from.x;
		const dyFromOrigin = newY - from.y;
		const distanceFromOrigin = Math.sqrt(dxFromOrigin * dxFromOrigin + dyFromOrigin * dyFromOrigin);

		if (distanceFromOrigin > this.maxDistance) {
			return true;
		}

		return false;
	}
}