import styled from "styled-components";
import { useGame } from "../hooks/useGame";
import { CenteredFlex, Flex, Text } from "../styles";
import type { Team } from "../game/types";

export function GameStatics() {
	const { soldiersPerTeam, gameResult, localPlayer } = useGame();

	return (
		<Flex 
		style={{position: "relative"}}
			$column 
			$align="flex-start"
			$gap={8}>
			<Text 
				$fontSize="m">
				Soldiers:
			</Text>
			<Flex $column $fontSize="s">
				{soldiersPerTeam
					.filter(({ team }) => team !== "neutral")
					.map(({ team, soldierCount }) => (
					<Flex key={team} $gap={4}>
						<Text $color={team}>{team}:</Text>
						<Text>{soldierCount}</Text>
					</Flex>
				))}
			</Flex>
			{gameResult.status !== "ongoing" && <ResultBanner $team={localPlayer.readState("team")}>
				<Text>{gameResult.status}</Text>
			</ResultBanner>}
		</Flex>
	);
}

const ResultBanner = styled(CenteredFlex)<{$team: Team}>`
	position: absolute;
	inset: 0px;
	background: ${({ theme, $team }) => theme.colors[$team as keyof typeof theme.colors]};
`