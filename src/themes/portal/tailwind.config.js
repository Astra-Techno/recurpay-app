/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
export default {
	darkMode: 'class', // Enable dark mode using the 'class' strategy
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
		'./formkit.theme.mjs'
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Open Sans"', 'sans-serif'], // Set Open Sans as the primary sans font
			},
			colors: {
				primary: '#004AAD',
				primaryDark: '#003382',
				primaryLight: '#1976D2',
				accent: '#00C6FF',
				success: '#10B981',
				error: '#EF4444',
				warning: '#F59E0B',
				muted: '#6B7280',
				surface: '#FFFFFF',
				background: '#F8FAFC',
				border: '#E5E7EB',
				text: {
					base: '#1F2937',
					muted: '#6B7280',
				}
			},
			keyframes: {
				fadeUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'fade-up': 'fadeUp 0.5s ease forwards',
			},
		},
	},
	safelist: [
		'bg-[var(--ui-background)]',
		'border-[var(--ui-outline)]',
		'border-[var(--ui-focus-outline)]',
		'text-[var(--ui-text)]',
		'text-[var(--ui-label)]',
		'text-[var(--ui-focus-outline)]',
		'ring-[var(--ui-focus-outline)]',
		'focus-within:bg-[var(--ui-focus-background)]',
		'focus-within:border-[var(--ui-focus-outline)]',
		'focus-within:ring-[var(--ui-focus-outline)]',
		'focus-within:text-[var(--ui-focus-text)]',
		'!bg-[var(--ui-background)]',
		'aria-selected:bg-[var(--ui-datepicker-selected-date-background)]'
	]
}