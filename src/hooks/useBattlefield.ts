import { useAtomValue } from "jotai";
import { gameAtom } from "./useGameStart";

export function useBattlefield() {
	const game  = useAtomValue(gameAtom);
	const battlefield = game.getBattlefield();

	return {
		buildings: battlefield.readState("buildings"),
		troops: battlefield.readState("troops"),
	};
}