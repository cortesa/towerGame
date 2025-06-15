import { InputHTMLAttributes } from "react"
import styled, { css } from "styled-components"

import { RESOURCE_URI } from "@/utils"

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
	$size?: string;
	$borderWidth?: string;
	$boxColor?: string;
	$boxCheckedColor?: string;
	$checkColor?: string;
}

const CheckboxStyle = css<CheckboxProps>`
	${({
		$size = "28px",
		$borderWidth = "2px",
		$boxColor = "red",
		$boxCheckedColor = "green",
		$checkColor = "white"
	}) => {

		return css`
			&:where([type="checkbox"]:not([role="switch"])) {
				appearance: none;
				width: ${$size};
				height: ${$size};
				border: ${$borderWidth} solid ${({ theme }) => theme.getColor($boxColor)};
				border-radius: 4px;
				background: transparent;
				cursor: pointer;
				transition: background 0.2s ease, border-color 0.2s ease;
				position: relative;
				display: inline-flex;
				align-items: center;
				justify-content: center;
			}

			&:where([type="checkbox"]:not([role="switch"])):hover {
				border: ${$borderWidth} solid ${({ theme }) => theme.getColor($boxCheckedColor)};
			}

			&:where([type="checkbox"]:not([role="switch"])):checked {
				background: ${({ theme }) => theme.getColor($boxCheckedColor)};
				border-color: ${({ theme }) => theme.getColor($boxCheckedColor)};
			}

			&:where([type="checkbox"]:not([role="switch"])):checked::before {
				content: "";
				position: absolute;
				width: 70%;
				height: 70%;
				mask: url(${RESOURCE_URI}checkmark.svg) no-repeat center;
				mask-size: contain;
				background-color: ${({ theme }) => theme.getColor($checkColor)};
			}
		`
	}}
`

export const Checkbox = styled.input.attrs(props => ({
	type: "checkbox",
	role: "checkbox",
	$boxColor: "background",
	$boxCheckedColor: "bitcoin",
	$checkColor: "background",
	...props
}))`
	${CheckboxStyle}
`
