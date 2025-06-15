import type { Team } from "./barrack";

export interface PlayerState {
  name: string;
  team: Team;
  wins: number;
  losses: number;
  totalSoldiers: number;
  attackRatio: number;
}

export class Player {
  public readonly id: string;
  private state: PlayerState;

  constructor( name: string, team: Exclude<Team, "neutral">) {
    
    this.id = crypto.randomUUID();
    this.state = {
      name,
      team,
      wins: 0,
      losses: 0,
      totalSoldiers: 0,
      attackRatio: 0.25,
    };
  }
  
  public toJSON() {
    return {
      id: this.id,
      ...this.readState()
    };
  }

  public readState(): PlayerState;
  public readState<K extends keyof PlayerState>(key: K): PlayerState[K];
  public readState<K extends keyof PlayerState>(key?: K) {
    return key ? this.state[key] : { ...this.state };
  }

  private setState(patch: Partial<PlayerState>) {
    Object.assign(this.state, patch);
  }

  public markWin() {
    this.setState({ wins: this.state.wins + 1 });
  }

  public markLoss() {
    this.setState({ losses: this.state.losses + 1 });
  }
  
  public setAttackRatio(ratio: number): void {
    this.setState({ attackRatio: ratio });
  }

}

