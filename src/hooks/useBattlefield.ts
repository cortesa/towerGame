import { useAtomValue } from "jotai";
import { gameAtom } from "./useGameStart";

export function useBattlefield() {
	const game  = useAtomValue(gameAtom);
	const battlefield = game.getBattlefield();

	return {
		barracks: battlefield.readState("barracks"),
		troops: battlefield.readState("troops"),
	};
}