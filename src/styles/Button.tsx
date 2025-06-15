import { type HTMLProps } from "react"
import styled, { css } from "styled-components"


import { theme } from "./themes"
import { FlexStyle, type FlexProps } from "./Flex"

export type ButtonProps = FlexProps
	& Omit<
		HTMLProps<HTMLButtonElement>,
		"ref" | "src" | "onChange"
	> & {
		$variant?: "default"
			| `default`
			| "bordered"
			| `bordered-${keyof typeof theme.colors}`
			| "simple"
			| "contrast"
			| "navigation"
			| "text-branded"
			| "text",
		$icon?: boolean,
		$active?: boolean
		// $size?: "sm" | "md" | "lg",
		// $hoverOnlyShadow?: boolean
	}

export const ButtonStyle = css<ButtonProps>`
	${FlexStyle}

	position: relative;
	outline: none;
	box-shadow: none;
	overflow: hidden;

	transition: all 0.3s ease-in-out;
	cursor: pointer;
	pointer-events: all;
	z-index: 0;

	& > * {
		z-index: 1;
	}
	& svg {
		margin: -50% 0;
	}

	justify-content: ${({ $justify = "center" }) => $justify};
	align-items: ${({ $align = "center" }) => $align};
	gap: ${({ $gap = 8 }) => typeof $gap === "string" ? $gap : $gap + "px"};
	white-space: ${({ $whiteSpace = "nowrap" }) => $whiteSpace};
	text-decoration: ${({ $textDecoration = "none" }) => $textDecoration};
	text-align: ${({ $textAlign = "center" }) => $textAlign};
	font-weight: ${({ $fontWeight = 700 }) => $fontWeight};

	padding: ${({ $padding = "12px 20px" }) => $padding};
	border-radius: 8px;

	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	${({ $icon }) => $icon && css`
		width: calc(1em + 24px);
		height: calc(1em + 24px);
		padding: 0px;
		border-radius: 4px;

		& img, & svg {
			width: auto;
			height: calc(1em + 8px);
		}
	`}

	${({
		theme,
		$variant = "default",
		$color,
		$active
	}) => {
		switch ($variant) {
			case "simple": return css`
				color: ${$color ? theme.getColor($color) : theme.colors.green};

				&:hover {
					color: ${theme.colors.text};
				}
			`
			case "contrast": return css`
				background: ${theme.colors.background};

				&:hover {
					background: ${theme.colors.backgroundDark};
				}
			`
			case "navigation": return css`
				background: ${theme.colors.backgroundDark};
				color: ${theme.colors.text};

				${$active && css`
					background: ${theme.colors.background};
					color: ${theme.colors.text};
				`}
				&:hover {
					background: ${theme.colors.background};
					color: ${theme.colors.text};
				}
			`
			case "text-branded": return css`
				background: transparent;
				color: ${theme.colors.green};
				padding: 0px;
					
				&:hover {
					color: ${theme.colors.bitcoin};
				}
					
				&:active {
					color: ${theme.colors.bitcoinDark};
				}
					
				&:disabled {
					cursor: not-allowed;
					color: ${theme.colors.greenDark};
				}
			`
			case "text": return css`
				background: transparent;
				color: ${theme.colors.text};
				padding: 0px;
				width: max-content;
				border-radius: 0px;
					
				&:hover {
					color: ${theme.colors.green};
					& > * {
						color: ${theme.colors.green};
					}
				}
					
				&:active {
					color: ${theme.colors.greenDark};
				}
					
				&:disabled {
					cursor: not-allowed;
					color: ${theme.colors.textDark};
				}
			`

			default: {
				const color = theme.getColor(
					$variant.split("-")[ 1 ] || "green",
					theme.colors.neutral
				)
				return $variant.includes("bordered")
					? css`
						background: ${theme.colors.background};
						color: ${color};
						border: 1px solid ${color};

						&:hover {
							background: ${color};
							color: ${theme.colors.background};
						}
					`
					: css`
						background: ${theme.colors.green};
						color: ${theme.colors.background};
						border: none;

						&:hover {
							background-color: ${theme.colors.orange};
  						background-position: top left;
							background-repeat: no-repeat;
							background-size: 250px;
						}
					`
			}
		}
	}}
`

export const Button = styled.button<ButtonProps>`
	${ButtonStyle}
`
