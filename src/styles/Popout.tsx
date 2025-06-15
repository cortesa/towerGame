import styled, { css, keyframes } from "styled-components"

import { Flex, type FlexProps } from "./Flex"

/* eslint-disable indent */

const anim = (deltaY: number | string, transform = "") => keyframes`
	0% {
		opacity: 0;
		transform: translateY(${deltaY}px) ${transform};
	}
	100% {
		opacity: 1;
		transform: translateY(0px) ${transform};
	}
`

export type PopoutProps = FlexProps & {
	$variant?: "default" | "default-yellow" | "chrome" | "dropdown" | "transparent",
	$float?: "left" | "center" | "right",
	$anchor?: "top" | "bottom",
	$margin?: string,
	$disableAnimation?: boolean,
	hidden?: boolean
}

export const Popout = styled(Flex).attrs<PopoutProps>(props => ({
	$column: true,
	$justify: "center",
	$align: "center",
	$grow: 0,
	$padding: "24px",
	$color: props.$variant === "default-yellow" ? "yellow" : "green",
	...props
}))`
	position: absolute;
	${({ $float = "center" }) => ($float === "center"
		? css`
			left: 50%;
			transform: translateX(-50%);
		`
		: $float === "left"
			? css`right: -8px;`
			: css`left: -8px;`
	)}
	${({ $anchor = "top", $margin = "20px" }) => ($anchor === "top"
		? css`
			top: 100%;
			margin-top: ${$margin};
		`
		: css`
			bottom: 100%;
			margin-bottom: ${$margin};
		`
	)}
	min-width: 240px;
	background-color: ${({ theme }) => theme.colors.background};
	box-shadow:
		0px 1px 6px rgba(0,0,0,0.1),
		0px -1px 6px rgba(0,0,0,0.1),
		1px 0px 6px rgba(0,0,0,0.1),
		-1px 0px 6px rgba(0,0,0,0.1);
	border-radius: 12px;

	&::after {
		content: "";
		position: absolute;
		inset: 0px;
		border-radius: inherit;
		background-color: ${({ theme }) => theme.colors.background};
		z-index: 0;
	}

	${({ theme, $variant = "default" }) => {
		switch ($variant) {
			case "chrome": return css`
				background: ${theme.gradients.spotlight};
				&::after {
					content: "";
					position: absolute;
					inset: 4px;
					border-radius: 20px;
					background-color: ${theme.colors.background};
					z-index: 0;
				}
			`

			case "transparent": return css`
				background-color: transparent;
					&::after {
						background-color: transparent;
					}
			`

			default: return css`
			 background: ${({ theme })=> theme.colors.background};
			 

			`
		}
	}}

	& > * {
		z-index: 1;
	}

	${({ hidden }) => hidden && css`display: none;`}
	${({
		hidden,
		$disableAnimation = false,
		$anchor = "top",
		$float = "center"
	}) => (
		!hidden && !$disableAnimation && css`
			animation: ${anim($anchor === "top" ? -8 : 8, $float === "center" ? "translateX(-50%)" : "")} 0.3s ease forwards;
		`
	)}

	z-index: 9998;
`
