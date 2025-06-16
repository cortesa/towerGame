import { Barrack, type BarrackConfig } from "./barrack";
import { Troop } from "./troop";
import { Player } from "./player";
import { Tower } from "./tower";
import type { BarrackAttackResult } from "./types";

interface BattlefieldState {
  barracks: Barrack[];
  troops: Troop[];
  players: Player[];
  towers: Tower[];
  soldiersPerTeam: { team: string; soldierCount: number }[];
}


export interface BattleEvent {
  type: "troop_arrived";
  data: {
    from: string;
    to: string;
    team: string;
    result: BarrackAttackResult;
  };
}

export class Battlefield {
  private state: BattlefieldState;

  constructor(config?: { barracks?: BarrackConfig[] }) {
    const barracks = config?.barracks?.map(cfg => new Barrack(cfg)) ?? [];
    const initialCounts: Record<string, number> = {};
    for (const barrack of barracks) {
      const { team, soldierCount } = barrack.readState();
      initialCounts[team] = (initialCounts[team] || 0) + soldierCount;
    }
    this.state = {
      barracks,
      troops: [],
      players: [],
      towers: [],
      soldiersPerTeam: Object.entries(initialCounts).map(([team, soldierCount]) => ({
        team,
        soldierCount,
      })),
    };
  }

  private setState(patch: Partial<BattlefieldState>) {
    Object.assign(this.state, patch);
  }

  public readState(): BattlefieldState;
  public readState<K extends keyof BattlefieldState>(key: K): BattlefieldState[K];
  public readState<K extends keyof BattlefieldState>(key?: K) {
    return key ? this.state[key] : { ...this.state };
  }

  public update(deltaTime: number): BattleEvent[] {
    const completedTroops: Troop[] = [];
    const events: BattleEvent[] = [];
    const count: Record<string, number> = Object.fromEntries(
      this.readState("soldiersPerTeam").map(({ team }) => [team, 0])
    );

    for (const barrack of this.readState("barracks")) {
      barrack.update();
      const { team, soldierCount } = barrack.readState();
      count[team] = (count[team] || 0) + soldierCount;
    }

    for (const troop of this.readState("troops")) {
      const result = troop.update(deltaTime);
      const { team, soldiers } = troop.readState();
      count[team] = (count[team] || 0) + soldiers;

      if (result.arrived) {
        events.push({
          type: "troop_arrived",
          data: {
            from: troop.origin.id,
            to: troop.target.id,
            team: troop.readState().team,
            result: result.result,
          },
        });
        completedTroops.push(troop);
      }
    }

    this.setState({
    	troops: this.readState("troops").filter(t => !completedTroops.includes(t)),
    	soldiersPerTeam: Object.entries(count).map(([team, soldierCount]) => ({
    		team,
    		soldierCount
    	}))
    })
    
    return events;
  }
  
  public addPlayer(player: Player) {
    this.readState("players").push(player);
  }

  public getBarrackById(id: string): Barrack | null {
    return this.readState("barracks").find(b => b.id === id) || null;
  }
  
  public addBarrack(config: BarrackConfig) {
    const barrack = new Barrack(config);
    this.readState("barracks").push(barrack);
  }

  public selectBarrack(barrackId: string, playerId: string) {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const barrack = this.readState("barracks").find(b => b.id === barrackId);
    if (!barrack) return;

    const playerTeam = player.readState("team")

    barrack.select(playerTeam);
  }
  
  public deselectAllBarracks( playerId: string): void {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const playerTeam = player.readState("team")

    for (const barrack of this.readState("barracks")) {
      barrack.deselect(playerTeam);
    }
  }

   public getTowerById(id: string): Tower | null {
    return this.readState("towers").find(t => t.id === id) || null;
  }

  public addTower(tower: Tower) {
    this.readState("towers").push(tower);
  }

  public selectTower(towerId: string, playerId: string) {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const tower = this.readState("towers").find(t => t.id === towerId);
    if (!tower) return;

    const playerTeam = player.readState("team");
    tower.select(playerTeam);
  }

  public deselectAllTowers(playerId: string): void {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const playerTeam = player.readState("team");

    for (const tower of this.readState("towers")) {
      tower.deselect(playerTeam);
    }
  }


  public attack(fromId: string, toId: string, byPlayerId: string) {
    const player = this.readState("players").find(p => p.id === byPlayerId);
    if (!player) return;

    const fromBarrack = this.readState("barracks").find(b => b.id === fromId);
    const toBarrack = this.readState("barracks").find(b => b.id === toId);
    if (!fromBarrack || !toBarrack) return;

    if (fromBarrack.readState("team") !== player.readState("team")) return;

    const currentSoldiers = fromBarrack.readState("soldierCount");
    const sendSoldiers = Math.floor(currentSoldiers * player.readState("attackRatio"));
    if (sendSoldiers <= 0) return;

    
    const newTroop = new Troop({
      origin: fromBarrack,
      target: toBarrack,
      soldiers: sendSoldiers,
      team: player.readState("team"),
    });

    this.readState("troops").push(newTroop);
  }
  
}