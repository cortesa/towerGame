import { atom, useAtom, useAtomValue } from "jotai";
import { gameAtom } from "./useGameStart";
import { useGameRenderTrigger } from "./useGameRenderTrigger";

const selectedAtom = atom<string | null>(null)

export function useGame() {
	useGameRenderTrigger();
	const game  = useAtomValue(gameAtom);
	const [selected, setSelected]=useAtom(selectedAtom)

	const gameState = game.readState()
 
	function handleBuildingClick(buildingId: string) {
		const building = game.getBattlefield().getBuildingById(buildingId);
		console.log('ACZ 1: ', building)
		if (!building) return;
		
		if (selected === buildingId) {
			resetSelection();
			return;
		}
		
		if (selected) {
			game.sendTroops(buildingId);
			setSelected(null);
			return;
		}
		
		if (game.selectOrigin(buildingId)) setSelected(buildingId);
		else setSelected(null);
	}

	function resetSelection() {
		game.resetSelection()
		setSelected(null)
	}

	function tryUpgrade(buildingId: string) {
		game.tryUpgrade(buildingId)
	}

	return {
		...gameState,
		selected,
		handleBuildingClick,
		tryUpgrade,
		resetSelection,
	};
}
