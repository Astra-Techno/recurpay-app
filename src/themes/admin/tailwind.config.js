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
				primary: 'var(--accent-small-area-splash)',
				primaryText: 'var(--ui-text)',
				primaryBg: 'var(--general-text-background)',
				 statementShade: 'var(--statement-shade)', // Use the CSS variable
				 statementTitle: 'var(--statement-title)', // Use the CSS variable
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