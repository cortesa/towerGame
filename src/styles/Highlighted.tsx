import styled, { css } from "styled-components"

import { Flex, type FlexProps } from "./Flex"

/* eslint-disable indent */

export type HighlightedProps = FlexProps & {
	$multiline?: boolean
}

export const Highlighted = styled(Flex).attrs<HighlightedProps>(props => ({
	$justify: "center",
	$align: "center",
	$gap: 8,
	...props
}))`
	position: relative;
	padding: ${({ $multiline }) => $multiline ? "24px" : "4px 8px"};
	border-radius: ${({ $multiline }) => $multiline ? "24px" : "999px"};
	font-size: ${({ $fontSize = "0.8em" }) => $fontSize};

	${({
		theme,
		$color,
		$multiline
	}) => css`
		&::before {
			content: "";
			position: absolute;
			inset: 0px;
			border-radius: ${$multiline ? "24px" : "999px"};
			background: ${$color
				? theme.getColor($color)
				: "currentColor"
			};
			filter: brightness(0.3);
			z-index: 0;
		}
		color: ${$color ? theme.getColor($color) : "currentColor"};
	`}

	& > * {
		z-index: 1;
	}
	& > svg {
		width: auto;
		height: 1.1em;
	}
`

