import { useAtomValue } from "jotai";
import { gameAtom } from "./useGameStart";

export function useBattlefield() {
	const game  = useAtomValue(gameAtom);
	const battlefield = game.getBattlefield();

	const { buildings, troops, projectiles} =battlefield.readState()


	return {
		buildings,
		troops,
		projectiles
	};
}