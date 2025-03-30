import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

const app = createApp(App)

// pinia store
const pinia = createPinia()
app.use(pinia)

import router from './router'
app.use(router)

// app css
import '@/assets/css/theme.css'
import '@/assets/css/admin.css'

// perfect scrollbar
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar'
app.use(PerfectScrollbarPlugin)

// vue-meta
import { createHead } from '@unhead/vue'
const head = createHead()
app.use(head)

// set default settings
import appSetting from './app-setting'
appSetting.init()

// vue-i18n
import i18n from '@/i18n'
app.use(i18n)

// popper
import Popper from 'vue3-popper'
app.component('Popper', Popper)

// formkit
import { plugin, defaultConfig } from '@formkit/vue'
import formKitConfig from '../../../formkit.config'
app.use(plugin, defaultConfig(formKitConfig))

// icon
import Icon from '@/components/elements/Icon.vue'
app.component('Icon', Icon) // Register globally

//Tag Component
import Tag from '@/components/elements/Tag.vue'
app.component('Tag', Tag) // Register globally

// default image
import defaultImage from '@/directives/defaultImage'
app.directive('default-image', defaultImage)

app.mount('#app')
