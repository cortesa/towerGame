import { BUILDING_UPGRADE_THRESHOLDS,  } from "./constants";
import type { BaseBuildingState, BuildingLevel } from "./types";

	export function calculateLevelFromSoldiers(soldiers: number, initialLevel?: BuildingLevel): BuildingLevel {
		for (const levelStr in BUILDING_UPGRADE_THRESHOLDS) {
			const level = Number(levelStr) as BuildingLevel;
			if (soldiers < BUILDING_UPGRADE_THRESHOLDS[level]) {
				return level;
			}
		}
		return initialLevel ?? 0;
	}

  export function evaluateUpgradeOption(state: BaseBuildingState, setState: (state: Partial<BaseBuildingState>) => void) {
		const {team, level} = state
    if (team === 'neutral') {
      setState({ canUpgrade: false });
      return;
    }

    const nextLevel = (level + 1);
    if (nextLevel > 3) {
      setState({ canUpgrade: false });
      return;
    }

    const threshold = BUILDING_UPGRADE_THRESHOLDS[level];
    setState({ 
      canUpgrade: state['soldierCount'] >= threshold,
    });
  }