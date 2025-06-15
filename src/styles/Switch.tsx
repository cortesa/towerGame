import styled, { css }  from "styled-components"
import { InputHTMLAttributes } from "react"

export type SwitchProps = InputHTMLAttributes<HTMLInputElement> & {
	$width?: number;
	$height?: number;
	$trackColor?: string;
	$trackCheckedColor?: string;
	$thumbColor?: string;
	$thumbCheckedColor?: string;
}

const SwitchStyle = css<SwitchProps>`
	${({
		$width,
		$height = 28,
		$trackColor = "red",
		$trackCheckedColor = "blue",
		$thumbColor = "white",
		$thumbCheckedColor = "green"
	}) => {

		const height = `${$height}px`
		const width = $width ? `${$width}px` : `${$height * 2}px`
		const padding = `${$height / 10}px`
		const thumbSize = `calc(min(${width}, ${height}) - ${padding} * 2)`

		return css`
			&:where([type="checkbox"][role="switch"]) {
				appearance: none;
				position: relative;
				font-size: inherit;
				width: ${width};
				height: ${height};
				box-sizing: content-box;
				border-radius: 999px;
				vertical-align: text-bottom;
				margin: auto;
				color: inherit;
				background: ${({ theme }) => theme.getColor($trackColor)};
				transition: background 0.3s ease;
			}

			&:where([type="checkbox"][role="switch"]):checked {
				background: ${({ theme }) => theme.getColor($trackCheckedColor)};
			}

			&:where([type="checkbox"][role="switch"])::before {
				content: "";
				position: absolute;
				top: 50%;
				left: ${padding};
				transform: translateY(-50%);
				width: ${thumbSize};
				height: ${thumbSize};
				border-radius: 999px;
				background: ${({ theme }) => theme.getColor($thumbColor)};
				transition: left 0.3s ease, background 0.3s ease;
			}

			&:where([type="checkbox"][role="switch"]):checked::before {
				left: calc(100% - ${thumbSize} - ${padding});
				background: ${({ theme }) => theme.getColor($thumbCheckedColor)};
			}
		`
	}}
`

export const Switch = styled.input.attrs(props => ({
	type: "checkbox",
	role: "switch",
	$height: 28,
	$trackColor: "background",
	$trackCheckedColor: "greenDark",
	$thumbColor: "neutral",
	$thumbCheckedColor: "green",
	...props
}))`
	${SwitchStyle}
`
