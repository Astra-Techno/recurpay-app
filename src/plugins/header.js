import { ref, readonly } from 'vue'

export default {
  install(app) {
    const headerState = {
      title: 'RecurPay',
      subtitle: ''
    }

    app.provide('headerState', headerState)
    
    app.config.globalProperties.$setHeader = (title, subtitle = '') => {
      headerState.title = title
      headerState.subtitle = subtitle
    }
  }
}
