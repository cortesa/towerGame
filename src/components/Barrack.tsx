import styled, { css, keyframes } from "styled-components"
import { CenteredFlex } from "../styles"
import { type theme } from "../styles/themes";
import { useClickHandlers } from "../hooks/useClickHandlers";
import { useGame } from "../hooks/useGame";
import { type Barrack as BarrackClass } from "../game/barrack";

export function Barrack({ barrackInstance }: { barrackInstance: BarrackClass }) {
	const {
		position,
		level,
		team,
		soldierCount,
		selected,
		isUpgrading,
		canUpgrade,
	} = barrackInstance.readState();

	const { handleBarrackClick, tryUpgrade } = useGame();

	const { onMouseDown, onMouseUp, onTouchStart, onTouchEnd } = useClickHandlers({
		onClick: () => handleBarrackClick(barrackInstance.id),
		onDoubleClick: () => tryUpgrade(barrackInstance.id),
		onLongPress: () => console.log("long press"),
	});

	return (
		<BarrackContainer
			$isSelected={selected}
			$position={position}
			$canUpgrade={canUpgrade}
			$level={level}
			$isUpgrading={isUpgrading}
			$team={team}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			$fontSize="s"
			$fontWeight={700}
		>
			{soldierCount}
		</BarrackContainer>
	);
}

type TeamColor = keyof typeof theme.colors;


const updatePulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4;}
  100% { opacity: 1;}
`;

const BarrackContainer = styled(CenteredFlex)<{ 
	$position: {x: number, y: number}
	$canUpgrade: boolean, 
	$level: number, 
	$isUpgrading: boolean
	$isSelected: boolean
	$team: TeamColor; }>`
	position: absolute;
	top: ${({$position}) => $position.y}px;
	left: ${({$position}) => $position.x}px;
	transform: translate(-50%, -50%);
	color: ${({ theme }) => theme.colors.textDark};
	width: 50px;
	height: 50px;
	aspect-ratio: 1 / 1;
	border-radius: 12px;
	background-color: ${({ theme }) => theme.colors.background};

	
	//Level Border
	${({ theme, $team }) => {
		const teamColor = theme.colors[$team as keyof typeof theme.colors];
		return css`
		border: 3px solid ${teamColor};
		
		&:hover {
			cursor: pointer;
			box-shadow: 0 0 8px 2px ${teamColor};
		}
			`;
		}};
		
	// Select
	${({ theme, $isSelected }) =>{
		const selectColor = theme.colors.bitcoin;
		return $isSelected &&
		css`
			border: 3px solid ${selectColor};
			box-shadow: 0 0 8px 2px ${selectColor};
		
			&:hover {
				box-shadow: 0 0 8px 2px ${selectColor};
			}
	  `
	}}

	// Updating
	${({ theme, $team, $isSelected, $isUpgrading }) =>{
		const levelColor = theme.colors[$team as keyof typeof theme.colors];
		const selectColor = theme.colors.bitcoin;
		return $isUpgrading &&
		css`
			box-shadow: 0 0 8px 2px ${$isSelected? selectColor:levelColor};
  		animation: ${updatePulse} 1s ease infinite;
	  `
	}}

	// Level Badge
	${({ theme, $level, $canUpgrade, $isUpgrading }) => {
	  const levelKey = `level${$level}` as keyof typeof theme.semanticColors;
	  const levelColor =
	    typeof theme.semanticColors[levelKey] === "string"
	      ? theme.semanticColors[levelKey]
	      : theme.semanticColors.level0;

	  const badgeColor = $canUpgrade ? theme.colors.green : levelColor;

	  return css`
	    &::before {
	      content: "${$level}";
	      color: ${theme.semanticColors.levelBadgeText};
	      font-size: ${theme.fontSizes.s};
	      position: absolute;
	      top: -10px;
	      left: -10px;
	      width: 20px;
	      height: 20px;
	      border-radius: 50%;
	      background-color: ${badgeColor};
				transition: opacity 0.5s ease;
				opacity: ${$isUpgrading? "0": "1"};
	    }
	  `;
	}}
`