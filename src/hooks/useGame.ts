import { atom, useAtom, useAtomValue } from "jotai";
import { gameAtom } from "./useGameStart";
import { useGameRenderTrigger } from "./useGameRenderTrigger";

const selectedAtom = atom<string | null>(null)

export function useGame() {
	useGameRenderTrigger();
	const game  = useAtomValue(gameAtom);
	const [selected, setSelected]=useAtom(selectedAtom)

	const gameState = game.readState()
 
	function handleBarrackClick(barrackId: string) {
		const barrack = game.getBattlefield().getBarrackById(barrackId);
		if (!barrack) return;
		
		if (selected === barrackId) {
			resetSelection()
			return
		};
		
		if (selected) {
			game.tryAttack(barrackId);
			setSelected(null);
			return;
		}
		
		if(game.selectOrigin(barrackId)) setSelected(barrackId)
		else setSelected(null)
	}

	function resetSelection() {
		game.resetSelection()
		setSelected(null)
	}

	function tryUpgrade(barrackId: string) {
		game.tryUpgrade(barrackId)
	}

	return {
		...gameState,
		selected,
		handleBarrackClick,
		tryUpgrade,
		resetSelection,
	};
}
