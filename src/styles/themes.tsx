const colors = {
	black: "#000000",
	red: "#FF5F5F",
	redDark: "#331313",
	orange: "#F5901A",
	orangeDark: "#4B351C",
	yellow: "#FFFD5F",
	yellowDark: "#696800",
	green: "#69FF5C",
	greenDark: "#2D4B2A",
	blue: "#5FA5FF",
	blueDark: "#132133",
	pink: "#FFB5D4",
	pinkDark: "#331927",
	magenta: "#D65CFF",
  magentaDark: "#2A0B33",

	neutral: "#696969",
	backgroundLight: "#3C3C3C",
	background: "#272727",
	backgroundDark: "#121212",
	text: "#FFFFFF",
	textDark: "#B5B5B5",

	bitcoin: "#F7931A",
	bitcoinDark: "#C96A1A"
}

const semanticColors = {
	levelBadgeText: colors.black,
	level0: colors.backgroundLight,
	level1: colors.blue,
	level2: colors.orange,
	level3: colors.pink,
	attack: colors.red,
	defense: colors.green,
	neutral: colors.neutral,
}

export const theme = {
	colors,
	semanticColors,
	gradients: {
		spotlight: `radial-gradient(
			circle at center,
			${colors.green} 0%,
			${colors.orange} 65%,
			transparent 100%
		)`
	},
	fontSizes: {
		xxs: "10px",
		xs: "12px",
		s: "14px",
		ms: "16px",
		m: "18px",
		ml: "20px",
		l: "24px",
		xl: "32px",
		xxl: "40px"
	},
	getColor: (color: string | undefined, fallback?: string) => (
		colors[ (color || "") as keyof typeof colors ]
		|| fallback
		|| color
		|| "transparent"
	)
}

export type Theme = typeof theme

declare module "styled-components" {
	export interface DefaultTheme extends Theme {}
}
