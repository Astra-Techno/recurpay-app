import { error } from '@formkit/core'

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class', // Enable dark mode using the 'class' strategy
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
		'./formkit.theme.mjs',
		'./formkit.config.mjs',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Open Sans"', 'sans-serif'], // Set Open Sans as the primary sans font
			},
			colors: {
				primary: '#0C9CFC',
				primaryText: '#404F6B',
				secondry: '#4B5668',
				badge: '#FF9000',
				badgeCompleted: '#53BC81',
				error: '#B71A1A',
				errorBg: '#FCEDED',
				success: '#53BC81',
				successBg: '#EEF8F2',
				alert: '#5E440F',
				alertBg: '#FFF1C8',
			},
		},
	},
}
