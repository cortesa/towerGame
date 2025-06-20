import { Building } from "./building"
import { MAX_SOLDIERS_PRODUCTION, SOLDIERS_PRODUCTION_COOLDOWN } from "./constants";
import type { BuildingConfig, BaseBuildingState, Team } from "./types";

export class Barrack extends Building<BaseBuildingState> {
  private soldierProductionCooldownTime: number = 0;

  /**
   * Creates a new Barrack building.
   * @param config - Configuration object for the building, including team assignment.
   */
  constructor(config: BuildingConfig) {
    super("barrack", config)
    const team: Team = config.team || "neutral"
    this.setState({
      isActive: team !== "neutral"
    })
  }

  /**
   * Updates the barrack state each frame.
   * Decreases the soldier production cooldown timer based on the elapsed delta time.
   * @param deltaTime - (s) The time elapsed since the last update call.
   */
  protected onUpdate(deltaTime: number): void {
    this.soldierProductionCooldownTime = Math.max(0, this.soldierProductionCooldownTime - deltaTime);
  }

  /**
   * Handles actions to perform when the barrack is conquered.
   * Activates the barrack upon conquest.
   */
  protected onConquered(): void {
    this.setState({isActive: true})
  }

  /**
   * Initiates the production of a soldier if conditions allow.
   * Increases the soldier count and resets the production cooldown timer.
   */
  public buildingAction(): void {
    if (this.soldierProductionCooldownTime > 0) return 
    const newSoldierCount = this.readState('soldierCount') + 1;
    if (newSoldierCount > MAX_SOLDIERS_PRODUCTION) return
    
    this.setState({ soldierCount: newSoldierCount });
    this.soldierProductionCooldownTime = SOLDIERS_PRODUCTION_COOLDOWN[this.readState("level")]
  }

}
