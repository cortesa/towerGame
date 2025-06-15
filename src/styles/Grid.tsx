import styled, { css } from "styled-components"

import { type TextProps, TextStyle } from "./Text"

type Alignment =
	| "stretch"
	| "flex-start"
	| "center"
	| "flex-end"
	| "space-between"
	| "space-around"
	| "space-evenly"

export type GridProps = TextProps & {
	$width?: string,
	$columns?: string,
	$rows?: string,
	$gap?: number | string,
	$justify?: Alignment,
	$align?: Alignment
}

export const GridStyle = css<GridProps>`
	${TextStyle}
	display: grid;
	${({ $width = undefined }) => $width && css`width: ${$width};`}
	${({ $columns = undefined }) => $columns && css`grid-template-columns: ${$columns};`}
	${({ $rows = undefined }) => $rows && css`grid-template-rows: ${$rows};`}
	${({ $gap = undefined }) => $gap && css`grid-gap: ${typeof $gap === "string" ? $gap : $gap + "px"};`}
	justify-items: ${({ $justify = "stretch" }) => $justify};
	align-items: ${({ $align = "stretch" }) => $align};
`

export const Grid = styled.div<GridProps>`
	${GridStyle}
`

export const FullWidthGridStyle = css`
	grid-column: 1 / -1;
`

export const FullHeightGridStyle = css`
	grid-row: 1 / -1;
`
