import styled, { css } from "styled-components"

import { type FlexProps, FlexStyle } from "./Flex"

export type ProgressCircleProps = FlexProps & {
	$progress: number,
	$progressColor?: string,
	$trackColor?: string,
	$trackWidth?: number,
	$size?: number,
	$width?: string,
	$height?: string
}

const ProgressCircleStyle = css<ProgressCircleProps>`
	${FlexStyle}

	${({
		theme,
		$size = 25,
		$trackWidth = 3,
		$progress = 0,
		$progressColor = "pink",
		$trackColor = "grey",
		$width = "100%",
		$height = "100%"
	}) => {

		const size = `max(${$size}px, ${$trackWidth}px)`
		const radiusBefore = `0px max(${$size * 10}px, ${$trackWidth * 10}px) max(${$size * 10}px, ${$trackWidth * 10}px) 0px`
		const radiusAfter = `max(${$size * 10}px, ${$trackWidth * 10}px) 0px 0px max(${$size * 10}px, ${$trackWidth * 10}px)`

		const progressColor = theme.getColor($progressColor)
		const trackColor = theme.getColor($trackColor)

		return css`
			position: relative;
			width: min(${$width},${size});
			height: min(${$height},${size});
			border-radius: 50%;
			border-width: ${$trackWidth}px;
			border-style: solid;
			border-color: ${progressColor};
			aspect-ratio: 1 / 1;


			&::before {
				content: "";
				position: absolute;
				top: -${$trackWidth}px;
				left: 50%;
				width: 50%;
				height: 100%;
				border-radius: ${radiusBefore};
				border-width: ${$trackWidth}px ${$trackWidth}px ${$trackWidth}px 0px;
				border-style: solid;
				border-color: ${$progress > 50 ? progressColor : trackColor};
				transform-origin: center left;
				transform: rotate(${$progress > 50 ? 0 : 360 * ($progress / 100)}deg);
				z-index: 1;
			}

			&::after {
				content: "";
				position: absolute;
				top: -${$trackWidth}px;
				right: 50%;
				width: 50%;
				height: 100%;
				border-radius: ${radiusAfter};
				border-width: ${$trackWidth}px 0px ${$trackWidth}px ${$trackWidth}px;
				border-style: solid;
				border-color: ${trackColor};
				transform-origin: center right;
				transform: rotate(${$progress < 50 ? 0 : 360 * (($progress - 50) / 100)}deg);
				z-index: 0;
			}

			& > * {
				z-index: 1;
			}
		`
	}}
`

export const ProgressCircle = styled.div.attrs<ProgressCircleProps>(props => ({
	$progressColor: "backgroundLight",
	$trackColor: "bitcoin",
	$justify: "center",
	$align: "center",
	$gap: 8,
	...props
}))`
	${ProgressCircleStyle}
	

`
