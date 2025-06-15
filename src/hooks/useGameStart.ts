import { atom, useAtomValue, useSetAtom} from 'jotai';
import { useEffect, useState } from 'react';
import { INITIAL_BARRACKS } from '../game/constants';
import { Game } from '../game/game';

export const gameTickerAtom = atom<number>(0);
export const gameAtom = atom<Game>(new Game('player1', 'blue', { barracks: INITIAL_BARRACKS }));

export function useGameStart() {
	const setTicker = useSetAtom(gameTickerAtom);
	const game = useAtomValue(gameAtom)
	const [isReady, setReady] = useState(false)

	useEffect(() => {
		if (!game) return
		const updateListener = () => {
			setTicker(game.readState("ticker").getTick())
		};
		game.onUpdate(updateListener);
		setReady(true);
		return () => {
			game.offUpdate(updateListener);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [game]);

	return isReady
}