import styled, { css } from "styled-components"

import { type FlexProps, FlexStyle } from "./Flex"

export type ProgressBarProps = FlexProps & {
	$progress: number,
	$variant?: "default" | "bordered" | "bright",
	$size?: "sm" | "md" | "lg"
}

const ProgressBarStyle = css<ProgressBarProps>`
	${FlexStyle}

	position: relative;
	border-radius: 999px;
	overflow: hidden;
	font-size: 0.6em;
	white-space: nowrap;
	flex-shrink: 0;

	${({ $size, $fontSize }) => {
		switch ($size) {
			case "sm": return css`
				padding: 8px 16px;
				font-size: ${$fontSize || "0.6em"};
			`
			case "md": return css`
				padding: 12px 24px;
				font-size: ${$fontSize || "0.72em"};
			`
			case "lg": return css`
				padding: 16px 30px;
				font-size: ${$fontSize || "0.8em"};
			`
		}
	}}

	&::before, &::after {
		content: "";
		position: absolute;
		inset: 0px;
		background: currentColor;
		filter: brightness(0.3);
		z-index: -1;
	}
	&::after {
		filter: brightness(0.5);
		right: ${({ $progress }) => (100 * (1 - $progress)).toFixed(3)}%;
		z-index: 0;
	}

	${({ theme, $variant }) => {
		switch ($variant) {
			case "bordered": return css`
				border: 2px solid currentColor;

				&::before {
					background: ${theme.colors.background};
				}
			`
			case "bright": return css`
				&::after {
					filter: none;
				}
			`
			default: return ""
		}
	}}

	& > * {
		z-index: 1;
	}
`

export const ProgressBar = styled.div.attrs<ProgressBarProps>(props => ({
	$variant: "default",
	$size: "md",
	$justify: "center",
	$align: "center",
	$gap: 8,
	...props
}))`
	${ProgressBarStyle}
`

