import styled, { css } from "styled-components"

import {  GridStyle, type GridProps } from "./Grid"
import { FlexStyle, type FlexProps } from "./Flex"

export type CardProps = {
	$variant?: "default" | "light" | "dark" | "split-top" | "split-bottom",
	$borderColor?: string
}

export const CardStyle = css<CardProps>`
	padding: 20px;
	border-radius: 12px;
	border: 1px solid ${({ theme, $borderColor }) => ($borderColor
		? theme.getColor($borderColor)
		: theme.colors.background
	)};
	transition: all 0.3s ease;

	${({ theme, $variant = "default" }) => {
		switch ($variant) {
			case "split-bottom":
			case "split-top": {
				const child = $variant.includes("top") ? 1 : 2

				return css`
				padding: 0px;

				& > * {
					width: 100%;
					padding: 20px;
				}

				& >	:nth-child(${child}) {
						border-radius: ${child === 1 ? "12px 12px 0px 0px" : "12px"};
						background: ${theme.colors.background};
					}
				}
			`}
			case "light": return css`
				background: ${theme.colors.backgroundLight};
			`
			case "dark": return css`
				background: ${theme.colors.background};
			`
		}
	}}
`

export const Card = {
	Flex: styled.div<FlexProps & CardProps>`
		${FlexStyle}
		${CardStyle}
	`,
	Grid: styled.div<GridProps & CardProps>`
		${GridStyle}
		${CardStyle}
	`
}
