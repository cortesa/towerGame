import { Building } from "./building"
import { MAX_SOLDIERS_PRODUCTION, SOLDIERS_PRODUCTION_COOLDOWN } from "./constants";
import type { BuildingConfig, BaseBuildingState, Team, BuildingLevel } from "./types";


export class Barrack extends Building<BaseBuildingState> {
  private actionCooldownTicks: number = 0;

  constructor(config: BuildingConfig) {
    super("barrack", config)
    const team: Team = config.team || "neutral"
    this.setState({
      isActive: team !== "neutral"
    })
  }

  public buildingAction( level: BuildingLevel ): void {
    if (this.actionCooldownTicks === 0) {
      const newSoldierCount = Math.min(MAX_SOLDIERS_PRODUCTION, this.readState('soldierCount') + 1);
      this.setState({ soldierCount: newSoldierCount });
      this.actionCooldownTicks = SOLDIERS_PRODUCTION_COOLDOWN[level]
    } else {
      this.actionCooldownTicks --
    }
  }
}
