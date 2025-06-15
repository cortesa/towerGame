import styled, { keyframes, css } from "styled-components"

import type { Keyframes } from "styled-components/dist/types"

import { type TextProps, TextStyle } from "./Text"
import { type FlexProps, FlexStyle } from "./Flex"
import { type GridProps, GridStyle } from "./Grid"

const createFadeInAnimation = ({
	x = "0px",
	y = "0px"
}: {
	x: string,
	y?: string
} | {
	x?: string,
	y: string
}) => keyframes`
	0% {
		opacity: 0;
		transform: translate(${x}, ${y});
	}
	100% {
		opacity: 1;
		transform: translate(
			0${x.includes("%") ? "%" : "px"},
			0${y.includes("%") ? "%" : "px"}
		);
	}
`

const createSlideAnimation = ({
	x = "0%",
	y = "0%"
}: {
	x: string,
	y?: string
} | {
	x?: string,
	y: string
}) => keyframes`
	0% { transform: translate(${x}, ${y}); }
	100% {
		transform: translate(
			0${x.includes("%") ? "%" : "px"},
			0${y.includes("%") ? "%" : "px"}
		);
	}
`

const animations = {
	fadeIn: createFadeInAnimation({ x: "0px" }),
	fadeInVertical: createFadeInAnimation({ y: "12px" }),
	fadeInHorizontal: createFadeInAnimation({ x: "12px" }),
	flipVisibility: keyframes`
		0% { opacity: 0; }
		50% { opacity: 0; }
		50.01% { opacity: 1; }
		100% { opacity: 1; }
	`,
	slideHorizontal: createSlideAnimation({ x: "100%" }),
	slideVertical: createSlideAnimation({ y: "100%" })
}

export type AnimatedProps = {
	$animDisabled?: boolean,
	$anim?: keyof typeof animations | Keyframes,
	$animDuration?: number,
	$animDelay?: number,
	$animDirection?: "normal" | "reverse" | "alternate" | "alternate-reverse",
	$animCount?: number | "infinite",
	$animEasing?: string
	$animFill?: "none" | "forwards" | "backwards" | "both"
}

const AnimatedStyle = css<AnimatedProps>`
	${({
		$animDisabled = false,
		$anim = "fadeInVertical",
		$animDuration = 0.5,
		$animDelay = 0,
		$animDirection = "normal",
		$animCount = 1,
		$animEasing = "linear",
		$animFill = "forwards"
	}) => {
		if ($animDisabled) return css`animation: none;`
		const anim = typeof $anim === "string"
			? animations[ $anim as keyof typeof animations ] || $anim
			: $anim
		const animCss = css`animation: ${anim} ${$animDuration}s ${$animEasing} ${$animDelay}s ${$animCount} ${$animDirection} ${$animFill};`
		if ($animDirection === "reverse" || $animDirection === "alternate-reverse") {
			return animCss
		}
		// set opacity to initial value to avoid flickering with $animDelay > 0
		switch ($anim) {
			case "fadeIn":
			case "fadeInVertical":
			case "fadeInHorizontal":
			case "flipVisibility":
				return css`
					${animCss}
					opacity: 0;
				`
			default: return animCss
		}
	}}
`

// type DivInProps = HTMLAttributes<HTMLDivElement> & AnimatedProps

// const DivIn = (props: DivInProps) => {
// 	const { setRef, isIntersecting: isVisible } = useIntersectionObserver()
// 	return (
// 		<StyledDivIn
// 			key={`DivIn-${isVisible ? "visible" : "hidden"}`}
// 			ref={setRef}
// 			$active={isVisible}
// 			{...props}
// 		/>
// 	)
// }

// const StyledDivIn = styled.div<AnimatedProps & { $active?: boolean }>`
// 	opacity: 0;
// 	${({ $active }) => $active && css`animation: ${animated.animations.fadeIn} 0.5s ease-in-out forwards;`}
// `

export const animated = {
	Style: AnimatedStyle,
	Text: styled.div<TextProps & AnimatedProps>`
		${AnimatedStyle}
		${TextStyle}
	`,
	Flex: styled.div<FlexProps & AnimatedProps>`
		${AnimatedStyle}
		${FlexStyle}
	`,
	Grid: styled.div<GridProps & AnimatedProps>`
		${AnimatedStyle}
		${GridStyle}
	`,
	create: {
		slide: createSlideAnimation,
		fadeIn: createFadeInAnimation
	},
	animations
}
