import { useAtomValue } from "jotai";
import { gameTickerAtom } from "./useGameStart";

/**
 * Forces the component to re-render on each game tick.
 * Does not return anything — only establishes a reactive link to the gameAtom.
 */
export function useGameRenderTrigger() {
	useAtomValue(gameTickerAtom); // triggers re-render on tick change
}