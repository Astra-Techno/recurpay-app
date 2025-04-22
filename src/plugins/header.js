import { ref, readonly } from 'vue'

export default {
  install(app) {
    const title = ref('')
    const subtitle = ref('')
    const isDashboard = ref(false)
    const icon = ref('')
    const actions = ref([])
    const customComponent = ref(null)

    const setHeader = (
      t = '',
      sub = '',
      dash = false,
      iconName = '',
      actionButtons = [],
      rightSlotComponent = null
    ) => {
      title.value = t
      subtitle.value = sub
      isDashboard.value = dash
      icon.value = iconName
      actions.value = actionButtons
      customComponent.value = rightSlotComponent
    }

    app.config.globalProperties.$setHeader = setHeader

    app.provide('headerState', {
      title: readonly(title),
      subtitle: readonly(subtitle),
      isDashboard: readonly(isDashboard),
      icon: readonly(icon),
      actions: readonly(actions),
      customComponent: readonly(customComponent),
    })
  }
}
