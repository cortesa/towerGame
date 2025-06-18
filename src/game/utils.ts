import { DEFAULT_BUILDING_THRESHOLDS } from "./constants";
import type { BuildingLevel } from "./types";

	export function calculateLevelFromSoldiers(soldiers: number, initialLevel?: BuildingLevel): BuildingLevel {
		for (const levelStr in DEFAULT_BUILDING_THRESHOLDS) {
			const level = Number(levelStr) as BuildingLevel;
			if (soldiers < DEFAULT_BUILDING_THRESHOLDS[level]) {
				return level;
			}
		}
		return initialLevel ?? 0;
	}