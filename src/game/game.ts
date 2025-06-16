import type { BarrackConfig } from "../game/barrack";
import { Battlefield } from "../game/battlefield";
import { Player } from "../game/player";
import { Ticker } from "../game/ticker";
import type { Team } from "./types";

export class Game {
	private state: {
		battlefield: Battlefield;
		localPlayer: Player;
		ticker: Ticker;
		soldiersPerTeam: { team: string; soldierCount: number }[];
		gameResult: { status: "victory" | "defeat" | "ongoing"; winner?: Team };
	} = {
		battlefield: new Battlefield(),
		localPlayer: new Player("placeholder", "blue"), // será sobrescrito en constructor
		ticker: new Ticker(),
		soldiersPerTeam: [],
		gameResult: { status: "ongoing" },
	};

	private listeners: Set<() => void> = new Set();

	public onUpdate(listener: () => void) {
		this.listeners.add(listener);
	}

	public offUpdate(listener: () => void) {
		this.listeners.delete(listener);
	}

	private notifyUpdate() {
		for (const listener of this.listeners) {
			listener();
		}
	}

	constructor(
		playerName: string,
		team: Exclude<Team, "neutral"> = "blue",
		battlefieldConfig?: { barracks?: BarrackConfig[] }
	) {
		this.setState({
			localPlayer: new Player(playerName, team),
			battlefield: new Battlefield(battlefieldConfig),
			ticker: new Ticker()
		});
		this.state.battlefield.addPlayer(this.state.localPlayer);

		this.state.ticker.on((deltaTime) => this.update(deltaTime));
		this.state.ticker.start();
	}

	public readState(): typeof this.state;
	public readState<K extends keyof typeof this.state>(key: K): typeof this.state[K];
	public readState<K extends keyof typeof this.state>(key?: K): typeof this.state | typeof this.state[K] {
		if (key) return this.state[key];
		return this.state;
	}

	private setState(patch: Partial<typeof this.state>) {
		Object.assign(this.state, patch);
	}

	public getBattlefield() {
		return this.state.battlefield;
	}

	public getPlayer() {
		return this.state.localPlayer;
	}

	public update(deltaTime: number) {
		const battlefield = this.readState("battlefield");
		battlefield.update(deltaTime);
		
		// const events = battlefield.update();
		// for (const event of events) {
		// 	console.log("ACZ: events", event)
		// }

		const soldiers = battlefield.readState("soldiersPerTeam");
		this.setState({ soldiersPerTeam: soldiers });
		const winner = this.evaluateGameOutcome(soldiers);
		if (winner) {
			console.log(`[Victory] Team '${winner}' has won the game!`);
			this.readState("ticker").stop();
		}
		this.notifyUpdate();
	}

	public tryUpgrade(barrackId: string): void {
		const barrack = this.state.battlefield.getBarrackById(barrackId);
		if (!barrack) return;

		const localTeam = this.state.localPlayer.readState("team");

		if (barrack.readState("team") === localTeam) {
			barrack.startUpgrade(localTeam);
		}
	}

	private selectedOriginBarrackId: string | null = null;

	public resetSelection(): void {
		this.state.battlefield.deselectAllBarracks(this.state.localPlayer.id);
		this.selectedOriginBarrackId = null;
	}

	public selectOrigin(barrackId: string): boolean {
		this.resetSelection();

		const barrack = this.state.battlefield.getBarrackById(barrackId);
		if (!barrack) return false;

		const localTeam = this.state.localPlayer.readState("team");

		if (barrack.readState("team") === localTeam) {
			this.selectedOriginBarrackId = barrackId;
			barrack.select(localTeam);
			return true;
		}

		return false;
	}

	public tryAttack(targetBarrackId: string) {
		if (!this.selectedOriginBarrackId || this.selectedOriginBarrackId === targetBarrackId) return;

		this.state.battlefield.attack(this.selectedOriginBarrackId, targetBarrackId, this.state.localPlayer.id);
		this.selectedOriginBarrackId = null;
		this.resetSelection();
	}
	
public evaluateGameOutcome(soldiers: { team: string; soldierCount: number }[]): Team | null {
	const localTeam = this.readState("localPlayer").readState("team");

	const localStats = soldiers.find(s => s.team === localTeam);
	if (!localStats || localStats.soldierCount <= 0) {
		console.log(`[Defeat] Team '${localTeam}' has no soldiers left!`);
		this.setState({ gameResult: { status: "defeat" } });
		return null;
	}

	const enemies = soldiers.filter(s => s.team !== localTeam && s.soldierCount > 0);
	if (enemies.length === 0) {
		console.log(`[Victory] Team '${localTeam}' has conquered all barracks!`);
		this.setState({ gameResult: { status: "victory", winner: localTeam } });
		return localTeam;
	}

	this.setState({ gameResult: { status: "ongoing" } });
	return null;
}

}
