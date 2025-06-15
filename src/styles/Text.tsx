import styled, { css } from "styled-components"

export type TextProps = {
	$width?: string,
	$height?: string,
	$color?: string,
	$textAlign?: "left" | "center" | "right",
	$fontFamily?: string,
	$fontSize?: string,
	$fontWeight?: number | "bold" | "bolder" | "normal" | "light" | "lighter",
	$whiteSpace?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line" | "break-spaces",
	$textOverflow?: "normal" | "ellipsis" | "clip",
	$textTransform?: "uppercase" | "capitalize" | "lowercase" | "none",
	$textDecoration?: "none" | "underline" | "overline" | "line-through"
	$letterSpacing?: string,
	$lineHeight?: string,
	$fontStyle?: "normal" | "italic",
	$padding?: string,
	$textShadow?: boolean | string,
	$inline?: boolean,
	hidden?: boolean
}

export const TextStyle = css<TextProps>`
	user-select: text;
	${({ $inline = false }) => $inline && css`display: inline;`}
	${({ $width = undefined }) => $width && css`width: ${$width};`}
	${({ $height = undefined }) => $height && css`height: ${$height};`}
	${({ theme, $color = undefined }) => $color && css`color: ${theme.getColor($color)};`}
	${({ $textAlign = undefined }) => $textAlign && css`text-align: ${$textAlign};`}
	${({ $fontFamily = undefined }) => $fontFamily && css`font-family: ${$fontFamily};`}
	${({ theme, $fontSize = undefined }) => $fontSize && css`
		font-size: ${theme.fontSizes[ $fontSize as keyof typeof theme.fontSizes ] || $fontSize};
	`}
	${({ $fontWeight = undefined }) => $fontWeight && css`font-weight: ${$fontWeight};`}
	${({ $whiteSpace = undefined }) => $whiteSpace && css`white-space: ${$whiteSpace};`}
	${({ $textOverflow = undefined }) => $textOverflow && css`text-overflow: ${$textOverflow};`}
	${({ $textTransform = undefined }) => $textTransform && css`text-transform: ${$textTransform};`}
	${({ $textDecoration = undefined }) => $textDecoration && css`text-decoration: ${$textDecoration};`}
	${({ $letterSpacing = undefined }) => $letterSpacing && css`letter-spacing: ${$letterSpacing};`}
	${({ $lineHeight = undefined }) => $lineHeight && css`line-height: ${$lineHeight};`}
	${({ $fontStyle = undefined }) => $fontStyle && css`font-style: ${$fontStyle};`}
	padding: ${({ $padding = "0px" }) => $padding};

	${({ theme, $textShadow }) => {
		if (!$textShadow) return ""

		const color = typeof $textShadow === "string"
			? theme.getColor($textShadow)
			: theme.colors.text
		return css`
			text-shadow:
				2px 2px 0.5px ${color},
				-2px 2px 0.5px ${color},
				2px -2px 0.5px ${color},
				-2px -2px 0.5px ${color},
				2px 0px 0.5px ${color},
				-2px 0px 0.5px ${color},
				0px 2px 0.5px ${color},
				0px -2px 0.5px ${color},
				1.3px 1.3px 0.25px ${color},
				-1.3px 1.3px 0.25px ${color},
				1.3px -1.3px 0.25px ${color},
				-1.3px -1.3px 0.25px ${color},
				1.8px 0px 0.25px ${color},
				-1.8px 0px 0.25px ${color},
				0px 1.8px 0.25px ${color},
				0px -1.8px 0.25px ${color}
			;
		`
	}}

	${({ hidden }) => hidden && css`display: none !important;`}
`

export const Text = styled.div<TextProps>`
	display: inline-block;
	${TextStyle}
`

export const Title = styled.h1.attrs<TextProps>(props => ({
	$fontSize: "xxl",
	...props
}))`
	${TextStyle}
`
