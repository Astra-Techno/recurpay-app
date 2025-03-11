import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import fs from 'fs'

export default defineConfig(({ command, mode }) => {
	// Load environment variables
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

	const HOST = `${process.env.VITE_HOST ?? 'localhost'}`
	const PORT = `${process.env.VITE_PORT ?? '5173'}`
	const THEME = `${process.env.VITE_PROJECT_BASE ?? 'client'}`
	const MEDIA_BASE_URL =
		process.env.VITE_MEDIA_BASE_URL || 'http://default-url'
	const IS_LOCAL = process.env.VITE_LOCAL_ENV || 0

	return {
		define: {
			'process.env.VITE_PROJECT_BASE': JSON.stringify(THEME),
		},
		plugins: [
			vue(),
			vueI18n({
				include: path.resolve(__dirname, './src/locales/**'),
			}),
		],
		css: {
			postcss: {
				plugins: [
					require('tailwindcss')(
						path.resolve(
							__dirname,
							`src/themes/${THEME}/tailwind.config.js`,
						),
					),
					require('autoprefixer'),
					require('cssnano')({ preset: 'default' }), // Minify CSS for production
				],
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		optimizeDeps: {
			include: [
				'vue',
				'vue-router',
				'@vueuse/core',
				'axios',
				'@intlify/core-base',
				'@formkit/vue',
			], // Add commonly used libraries for pre-bundling
		},
		server: {
			hmr: { overlay: true }, // Enable Hot Module Replacement with overlay for errors
			host: HOST,
			port: PORT,
			proxy: {
				'/media/images': {
					target: MEDIA_BASE_URL,
					changeOrigin: true,
					rewrite: path => path.replace(/^\/media/, ''),
				},
			},
		},
		build: {
			target: 'esnext',
			outDir: `dist/${THEME}`,
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				input: {
					main: path.resolve(
						__dirname,
						`src/themes/${THEME}/index.html`,
					), // Specify theme-specific index.html
				},
				output: {
					manualChunks: {
						vendor: ['vue', 'vue-router', '@formkit/vue'],
					},
				},
			},
			sourcemap: false,
		},
		base: command === 'build' && IS_LOCAL == 1 ? `/${THEME}/` : '/', // Set base only for build command
	}
})
