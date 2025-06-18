import { Barrack, type BarrackConfig } from "./barrack";
import { Troop } from "./troop";
import { Player } from "./player";
import { Tower, type TowerConfig } from "./tower";
import type { BarrackAttackResult, BuildingMap } from "./types";

interface BattlefieldState {
  buildings: (Barrack | Tower)[];
  troops: Troop[];
  players: Player[];
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

  constructor(config?: { barracks?: BarrackConfig[], towers?: TowerConfig[] }) {
    const barracks = config?.barracks?.map(cfg => new Barrack(cfg)) ?? [];
    const towers = config?.towers?.map(cfg => new Tower(cfg)) ?? [];
    const buildings = [ ...towers, ...barracks ];
    const initialCounts: Record<string, number> = {};
    for (const building of buildings) {
      const { team, soldierCount } = building.readState();
      initialCounts[team] = (initialCounts[team] || 0) + soldierCount;
    }
    this.state = {
      players: [],
      buildings,
      troops: [],
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
    const troops = this.readState("troops")


    for (const barrack of this.readState("buildings").filter(b => b instanceof Barrack)) {
      barrack.update();
      const { team, soldierCount } = barrack.readState();
      count[team] = (count[team] || 0) + soldierCount;
    }
 
    if (troops.length > 0) {
      for (const tower of this.readState("buildings").filter(b => b instanceof Tower)) {
        tower.update(deltaTime, this.readState("troops"));
        const { team, soldierCount } = tower.readState();
        count[team] = (count[team] || 0) + soldierCount;
      }
  }

    for (const troop of this.readState("troops")) {
      const updateResult = troop.update(deltaTime);
      const { team, soldiers } = troop.readState();
      count[team] = (count[team] || 0) + soldiers;

      const isDead = troop.readState("soldiers") <= 0;
      if (updateResult.arrived || isDead) {
        if (!isDead && updateResult.arrived) {
          events.push({
            type: "troop_arrived",
            data: {
              from: troop.origin.id,
              to: troop.target.id,
              team: troop.readState().team,
              result: updateResult.result,
            },
          });
        }
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
  
  public addBarrack(config: BarrackConfig) {
    const barrack = new Barrack(config);
    this.readState("buildings").push(barrack);
  }

  public selectBarrack(barrackId: string, playerId: string) {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const barrack = this.readState("buildings").filter(b => b instanceof Barrack).find(b => b.id === barrackId);
    if (!barrack) return;

    const playerTeam = player.readState("team")

    barrack.select(playerTeam);
  }
  
  public deselectAllBuildings( playerId: string): void {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const playerTeam = player.readState("team")

    for (const building of this.readState("buildings")) {
      building.deselect(playerTeam);
    }
  }

  public addTower(tower: Tower) {
    this.readState("buildings").push(tower);
  }

  public selectTower(towerId: string, playerId: string) {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const tower = this.readState("buildings").filter(t => t instanceof Tower).find(t => t.id === towerId);
    if (!tower) return;

    const playerTeam = player.readState("team");
    tower.select(playerTeam);
  }

  public deselectAllTowers(playerId: string): void {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const playerTeam = player.readState("team");

    for (const tower of this.readState("buildings").filter(t => t instanceof Tower)) {
      tower.deselect(playerTeam);
    }
  }


  public attack(fromId: string, toId: string, byPlayerId: string) {
    const player = this.readState("players").find(p => p.id === byPlayerId);
    if (!player) return;

    const fromBuilding = this.readState("buildings").find(b => b.id === fromId);
    const toBuilding = this.readState("buildings").find(b => b.id === toId);
    if (!fromBuilding || !toBuilding) return;

    if (fromBuilding.readState("team") !== player.readState("team")) return;

    const currentSoldiers = fromBuilding.readState("soldierCount");
    const sendSoldiers = Math.floor(currentSoldiers * player.readState("attackRatio"));
    if (sendSoldiers <= 0) return;

    
    const newTroop = new Troop({
      origin: fromBuilding,
      target: toBuilding,
      soldiers: sendSoldiers,
      team: player.readState("team"),
    });

    this.readState("troops").push(newTroop);
  }
  
public getBuildingById<T extends keyof BuildingMap>(
  id: string,
  buildingType?: T
): BuildingMap[T] | null {
  const building = this.readState("buildings").find(b => b.id === id);
  if (!building) return null;

  if (!buildingType) return building as BuildingMap[T];

  if (buildingType === "barrack" && building instanceof Barrack) return building as BuildingMap[T];
  if (buildingType === "tower" && building instanceof Tower) return building as BuildingMap[T];

  return null;
}
  
}