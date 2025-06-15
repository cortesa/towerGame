import { useAtomValue } from "jotai";
import { tickAtom } from "../game/state";

export function useGameTicker() {
	useAtomValue(tickAtom);
}