import { Barrack } from "./barrack";
import { Troop } from "./troop";
import { Player } from "./player";
import { Tower } from "./tower";
import type { BuildingConfig, TroopArrivalOutcome } from "./types";

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
    result: TroopArrivalOutcome;
  };
}

export class Battlefield {
  private state: BattlefieldState;

  constructor(config?: { barracks?: BuildingConfig[], towers?: BuildingConfig[] }) {
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
      barrack.update(deltaTime);
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

  public deselectAllByPlayer(playerId: string): void {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const playerTeam = player.readState("team");

    for (const building of this.readState("buildings")) {
      building.deselect(playerTeam);
    }
  }

  public addBuilding(building: Barrack | Tower): void {
    this.readState("buildings").push(building);
  }

  public selectBuildingById(buildingId: string, playerId: string): void {
    const player = this.readState("players").find(p => p.id === playerId);
    if (!player) return;

    const building = this.readState("buildings").find(b => b.id === buildingId);
    if (!building) return;

    const playerTeam = player.readState("team");
    building.select(playerTeam);
  }

  public sendTroops(fromId: string, toId: string, byPlayerId: string) {
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