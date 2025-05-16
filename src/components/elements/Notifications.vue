<template>
  <div class="p-4 max-w-4xl mx-auto">
    <transition name="fade-slide" mode="out-in">
      <List
        key="notification-list"
        tmpl="list"
        :data-url="apiUrl"
        :search="false"
        :show-filter="false"
        :show-pagination="true"
        :filter-toggle="false"
        @row-click="markRead"
        :messages="{ empty: 'No New Notifications' }"
      >
        <template #li-item="{ item }">
          <div class="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer">
            <a v-if="item.url" :href="item.url" class="text-sm font-semibold text-blue-600 hover:underline">
              {{ item.title }}
            </a>
            <span v-else class="text-sm font-semibold text-gray-800">{{ item.title }}</span>
            <p class="text-xs text-gray-600">{{ item.message }}</p>
            <div class="text-xs text-gray-400 flex justify-between mt-1">
              <span>{{ formatDate(item.created_at) }}</span>
              <span v-if="item.added_by_name">By: {{ item.added_by_name }}</span>
            </div>
          </div>
        </template>
      </List>
    </transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import List from '@/components/List/List.vue'
import { useAppStore } from '@/stores/index'
import { useNotificationStore } from '@/stores/notifications'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'
import dayjs from 'dayjs'

const request = useApiRequest()
const user = useAppStore().getUser()
const store = useNotificationStore()
const apiUrl = `list/System/Notifications?user_id=${user.id}`

function formatDate(date) {
  return dayjs(date).format('MMM D, h:mm A')
}

async function markRead(item) {
  if (!item.read_at) {
    const res = await request.post('task/Notification/markAsRead', item.value)
    if (!res.error) {
      store.markAsRead()
    } else {
      Signal.error(res.message)
    }
  }
  if (item.url) window.location.href = item.url
}

onMounted(() => {
  if (window.Echo && user.id) {
    window.Echo.private(`user.${user.id}`).listen('NewNotification', () => {
      store.incrementUnread()
    })
  }
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
