import { Building } from "./building"
import { MAX_SOLDIERS_PRODUCTION, SOLDIERS_PRODUCTION_COOLDOWN } from "./constants";
import type { BuildingConfig, BaseBuildingState, Team, BuildingLevel } from "./types";


export class Barrack extends Building<BaseBuildingState> {
  private soldierProductionCooldownTime: number = 0;

  constructor(config: BuildingConfig) {
    super("barrack", config)
    const team: Team = config.team || "neutral"
    this.setState({
      isActive: team !== "neutral"
    })
  }

  protected onUpdate(deltaTime: number): void {
    this.soldierProductionCooldownTime = Math.max(0, this.soldierProductionCooldownTime - deltaTime);
  }

  public buildingAction(): void {
    if (this.soldierProductionCooldownTime > 0) return 
    
    const newSoldierCount = Math.min(MAX_SOLDIERS_PRODUCTION, this.readState('soldierCount') + 1);
    this.setState({ soldierCount: newSoldierCount });
    this.soldierProductionCooldownTime = SOLDIERS_PRODUCTION_COOLDOWN[this.readState("level")]
    
  }

}
