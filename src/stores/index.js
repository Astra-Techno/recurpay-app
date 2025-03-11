import { defineStore } from 'pinia'
import i18n from '@/i18n'
import session from '@/stores/session'

export const useAppStore = defineStore('app', {
	state: () => ({
		user: {
			token: session.getItem('token'),
			data: session.getItem('user'),
			guest: session.getItem('guest'),
		},
		isDarkMode: false,
		mainLayout: 'auth',
		menu: 'vertical',
		layout: 'full',
		rtlClass: 'ltr',
		animation: '',
		navbar: 'navbar-sticky',
		locale: 'en',
		sidebar: false,
		fullview: 0,
		languageList: [{ code: 'en', name: 'English' }],
		isShowMainLoader: true,
		ShowComponent: false,
		semidark: false,
		background: 'RecurPay',
		userPages: ['login', 'register', 'request-password', 'reset-password'],
		guestPages: ['inspection/panoview'],
		theme: import.meta.env.VITE_PROJECT_BASE || 'client',
		headers: JSON.parse(session.getItem('headers')) || {},
	}),

	actions: {
		addGuestPages(page) {
			this.guestPages.push(page)
		},
		setMainLayout(payload = null) {
			this.mainLayout = payload //app , auth
		},
		setUser(user = null) {
			this.user.data = user
			if (user !== null) user = JSON.stringify(user)
			session.setItem('user', user)
		},
		setToken(token = null) {
			this.user.token = token
			session.setItem('token', token)
		},
		setGuest(guest) {
			this.user.guest = guest
			session.setItem('guest', guest)
		},
		getUser() {
			return JSON.parse(session.getItem('user'))
		},
		toggleTheme(payload = null) {
			payload = payload || this.theme // light|dark|system
			localStorage.setItem('theme', payload)
			this.theme = payload
			if (payload == 'light') {
				this.isDarkMode = false
			} else if (payload == 'dark') {
				this.isDarkMode = true
			} else if (payload == 'system') {
				if (
					window.matchMedia &&
					window.matchMedia('(prefers-color-scheme: dark)').matches
				) {
					this.isDarkMode = true
				} else {
					this.isDarkMode = false
				}
			}

			if (this.isDarkMode) {
				document.querySelector('body')?.classList.add('bg-black')
			} else {
				document.querySelector('body')?.classList.remove('bg-black')
			}
		},
		toggleMenu(payload = null) {
			payload = payload || this.menu // vertical, collapsible-vertical, horizontal
			this.sidebar = false // reset sidebar state
			localStorage.setItem('menu', payload)
			this.menu = payload
		},
		toggleLayout(payload = null) {
			payload = payload || this.layout // full, boxed-layout
			localStorage.setItem('layout', payload)
			this.layout = payload
		},
		toggleRTL(payload = null) {
			payload = payload || this.rtlClass // rtl, ltr
			localStorage.setItem('rtlClass', payload)
			this.rtlClass = payload
			document
				.querySelector('html')
				?.setAttribute('dir', this.rtlClass || 'ltr')
		},
		toggleAnimation(payload = null) {
			payload = payload || this.animation // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
			payload = payload?.trim()
			localStorage.setItem('animation', payload)
			this.animation = payload
			//appSetting.changeAnimation()
		},
		toggleNavbar(payload = null) {
			payload = payload || this.navbar // navbar-sticky, navbar-floating, navbar-static
			localStorage.setItem('navbar', payload)
			this.navbar = payload
		},
		toggleSemidark(payload = null) {
			payload = payload || false
			localStorage.setItem('semidark', payload)
			this.semidark = payload
		},
		toggleLocale(payload = null) {
			payload = payload || this.locale
			i18n.global.locale.value = payload
			localStorage.setItem('i18n_locale', payload)
			this.locale = payload
			if (this.locale?.toLowerCase() === 'ae') {
				this.toggleRTL('rtl')
			} else {
				this.toggleRTL('ltr')
			}
		},
		toggleSidebar(state = false) {
			this.sidebar = !this.sidebar
		},
		toggleMainLoader(state = false) {
			this.isShowMainLoader = true
			setTimeout(() => {
				this.isShowMainLoader = false
			}, 500)
		},
		toggleComponent(state = false) {
			this.ShowComponent = state
		},
		toggleFullView(val = false) {
			this.fullview = val
			//localStorage.setItem("fullview",val);
		},
		setHeader(key, value) {
			this.headers[key] = value
			session.setItem('headers', JSON.stringify(this.headers))
		},
		removeHeader(key) {
			delete this.headers[key]
			session.setItem('headers', JSON.stringify(this.headers))
			if (!this.headers.length) {
				session.setItem('headers', null)
			}
		},
	},
	getters: {},
})
