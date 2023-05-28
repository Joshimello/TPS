import { defineConfig } from 'windicss/helpers'

// https://windicss.org/guide/configuration.html
export default defineConfig({
	theme: {
		extend: {
			fontFamily: {
				sans: 'Space Grotesk',
				mono: 'IBM Plex Mono'
			}
		}
	}
})