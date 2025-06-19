import styled, { css, keyframes } from "styled-components"
import { CenteredFlex } from "../styles"
import { type theme } from "../styles/themes";
import { useClickHandlers } from "../hooks/useClickHandlers";
import { useGame } from "../hooks/useGame";
import { type Tower as TowerClass } from "../game/tower";

/**
 * React component representing a Tower in the game.
 * Displays tower state and handles user interactions.
 *
 * @param {Object} props - Component props.
 * @param {TowerClass} props.towerInstance - Instance of the Tower game object.
 * @returns {JSX.Element} Rendered Tower component.
 */
export function Tower({ towerInstance }: { towerInstance: TowerClass }) {
	const {
		position,
		level,
		team,
		soldierCount,
		selected,
		isUpgrading,
		canUpgrade,
		attackRange
	} = towerInstance.readState();

	const { handleBuildingClick, tryUpgrade } = useGame();

	const { onMouseDown, onMouseUp, onTouchStart, onTouchEnd } = useClickHandlers({
		/**
		 * Handles a single click event on the tower.
		 * Invokes the building click handler with the tower's ID.
		 */
		onClick: () => handleBuildingClick(towerInstance.id),

		/**
		 * Handles a double click event on the tower.
		 * Attempts to upgrade the tower.
		 */
		onDoubleClick: () => tryUpgrade(towerInstance.id),

		/**
		 * Handles a long press event on the tower.
		 * Currently logs a message to the console.
		 */
		onLongPress: () => console.log("long press"),
	});

	return (
		<TowerContainer
			$isSelected={selected}
			$position={position}
			$canUpgrade={canUpgrade}
			$level={level}
			$isUpgrading={isUpgrading}
			$team={team}
			$range={attackRange}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			$fontSize="s"
			$fontWeight={700}
		>
			{soldierCount}
		</TowerContainer>
	);
}

type TeamColor = keyof typeof theme.colors;


/**
 * Keyframes animation for the update pulse effect.
 */
const updatePulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4;}
  100% { opacity: 1;}
`;

const TowerContainer = styled(CenteredFlex)<{ 
	$position: {x: number, y: number}
	$canUpgrade: boolean, 
	$level: number, 
	$isUpgrading: boolean
	$isSelected: boolean
	$team: TeamColor 
	$range: number}>`
	position: absolute;
	top: ${({$position}) => $position.y}px;
	left: ${({$position}) => $position.x}px;
	transform: translate(-50%, -50%);
	color: ${({ theme }) => theme.colors.textDark};
	width: 50px;
	height: auto;
	aspect-ratio: 1 / 1;
	border-radius: 999px;
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

	// Attack range
	${({ theme, $range, $level, $canUpgrade, $isUpgrading }) => {return css`
		&::after {
			content: "";
			position: absolute;
			width: ${$range * 2}px;
			aspect-ratio: 1/1;
			border-radius: 999px;

			border: 1px solid ${({theme}) => theme.colors.backgroundLight};
			pointer-events: none;
			z-index: -1;
		}
	`}}

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