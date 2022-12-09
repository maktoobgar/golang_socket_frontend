/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	// darkMode: 'media', // 'media' or 'class' or false

	content: ["./src/**/*.{js,ts,jsx,tsx,css}"],

	plugins: [],

	theme: {
		screens: {
			xs: "475px",
			xsMax: { max: "475px" },
			smMax: { max: "640px" },
			mdMax: { max: "768px" },
			lgMax: { max: "1024px" },
			xlMax: { max: "1280px" },
			"2xlMax": { max: "1536px" },
			...defaultTheme.screens,
		},
	},
};
