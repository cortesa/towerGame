import { TROOP_SPEED } from "./constants";
import type { BuildingLevel, IBuilding, ITroop, Team, TroopArrivalOutcome, TroopState } from "./types";




export class Troop implements ITroop {
  public readonly id: string;
  private origin: IBuilding;
  private target: IBuilding;
  private totalTime: number;
  private elapsedTime: number = 0;
  private state: TroopState;
  private troopLevel: BuildingLevel

  constructor({ origin, target, soldiers, team }: { origin: IBuilding; target: IBuilding; soldiers: number; team: Team }) {
    this.id = crypto.randomUUID();
    this.origin = origin;
    this.target = target;
    this.troopLevel = origin.readState("level");

    const dx = target.readState("position").x - origin.readState("position").x;
    const dy = target.readState("position").y - origin.readState("position").y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.totalTime = distance / TROOP_SPEED[this.troopLevel];

    const originCount = origin.readState("soldierCount");
    origin.updateSoldierCount(originCount - soldiers);

    this.state = {
      team,
      soldiers,
      position: origin.readState("position"),
    };
  }

  public readState(): TroopState;
  public readState<K extends keyof TroopState>(key: K): TroopState[K];
  public readState<K extends keyof TroopState>(key?: K) {
    return key ? this.state[key] : { ...this.state };
  }

  public updateSoldierCount(soldierCount: number): void {
    this.setState({ soldier: soldierCount } as Partial<TroopState>);
  }

  private setState(patch: Partial<TroopState>) {
    Object.assign(this.state, patch);
  }
  
  /**
 * Updates the state of the object.
 * @param deltaTime Time elapsed since last update, **in seconds**.
 */
  public update(deltaTime: number): { arrived: true; result: TroopArrivalOutcome } | { arrived: false } {
    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= this.totalTime) {
      const result = this.target.onTroopArrival(this.state.team, this.state.soldiers);
      return { arrived: true, result };
    }

    const progress = this.elapsedTime / this.totalTime;
    const start = this.origin.readState("position");
    const end = this.target.readState("position");

    this.setState({
      position: {
        x: start.x + (end.x - start.x) * progress,
        y: start.y + (end.y - start.y) * progress,
      },
    });

    return { arrived: false };
  }

  public takeDamage(amount: number) {
    this.setState({
      soldiers: Math.max(0, this.readState("soldiers") - amount),
    });
  }
}
