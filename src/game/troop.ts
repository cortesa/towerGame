import type { Barrack, Team, AttackResult } from "./barrack";

const TROOP_SPEED = 2; // px/tick

export type TroopState = {
  team: Team;
  soldiers: number;
  position: { x: number; y: number };
};

export class Troop {
  public readonly id: string;
  origin: Barrack;
  target: Barrack;
  totalTime: number;
  elapsedTime: number = 0;
  private state: TroopState;

  constructor({ origin, target, soldiers, team }: { origin: Barrack; target: Barrack; soldiers: number; team: Team }) {
    this.id = crypto.randomUUID();
    this.origin = origin;
    this.target = target;

    const dx = target.getPosition().x - origin.getPosition().x;
    const dy = target.getPosition().y - origin.getPosition().y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.totalTime = Math.ceil(distance / TROOP_SPEED);

    const originCount = origin.readState("soldierCount");
    origin.updateSoldierCount(originCount - soldiers);

    this.state = {
      team,
      soldiers,
      position: origin.getPosition(),
    };
  }

  public update(): { arrived: true; result: AttackResult } | { arrived: false } {
    this.elapsedTime++;

    if (this.elapsedTime >= this.totalTime) {
      const result = this.target.applyAttack(this.state.team, this.state.soldiers);
      return { arrived: true, result };
    }

    const progress = this.elapsedTime / this.totalTime;
    const start = this.origin.getPosition();
    const end = this.target.getPosition();

    this.state.position = {
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress,
    };

    return { arrived: false };
  }

  public readState(): TroopState {
    return this.state;
  }
}