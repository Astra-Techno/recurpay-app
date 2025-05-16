// stores/notification.js
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    showPanel: false,
    unreadCount: 0
  }),
  actions: {
    togglePanel() {
      this.showPanel = !this.showPanel
    },
    incrementUnread() {
      this.unreadCount++
    },
    decrementUnread() {
      this.unreadCount = Math.max(0, this.unreadCount - 1)
    },
    resetUnread() {
      this.unreadCount = 0
    }
  }
})
