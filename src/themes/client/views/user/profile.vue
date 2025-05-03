<template>
  <div>
    <!-- Top Profile Info -->
    <div class="bg-white shadow-sm px-4 py-6 flex items-center gap-4">
      <img class="w-12 h-12 rounded-full object-cover" src="https://i.pravatar.cc/150?img=5" alt="Profile" />
      <div class="flex-1">
        <p class="font-semibold text-gray-800 truncate">{{ user.name }}</p>
        <p class="text-xs text-gray-500">Account Details</p>
      </div>
    </div>

    <!-- Sections with Slide Animation -->
    <transition name="slide-fade" mode="out-in">
      <div v-if="!expanded" key="list">
        <div class="divide-y divide-gray-200">
          <div v-for="section in sections" :key="section.key" @click="toggleExpand(section.key)">
            <ProfileItem :icon="section.icon" :label="section.title" :sub="section.subtitle" />
          </div>

          <!-- Logout -->
          <div @click="logout"
            class="bg-white cursor-pointer px-4 py-4 flex justify-between items-center hover:bg-red-50">
            <div class="flex items-center gap-3 text-red-600 font-semibold">
              <span>🚪</span>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Expanded Section Panel -->
      <div v-else key="expanded" class="bg-white p-4 min-h-[200px]">
        <div class="flex justify-between items-center mb-4">
          <span @click="expanded = null" class="text-sm text-blue-500"><span
              class="cursor-pointer hover:text-blue-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-blue-500" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M9.707 17.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L6.414 11H20a1 1 0 110 2H6.414l3.293 3.293a1 1 0 010 1.414z" />
              </svg>
            </span></span>
        </div>
        <!-- Dynamically rendered component with passed props -->
        <component :is="currentSection.component" v-bind="currentSection.data" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useApiRequest from '@/composables/request'
import ProfileItem from '@/components/profile/ProfileItem.vue'
import UserDetails from '@/components/profile/UserDetails.vue'
import MyPayments from '@/components/profile/Payments.vue'
import AccountDetails from '@/components/profile/AccountDetails.vue'
import UpdatePassword from '@/components/profile/PasswordUpdate.vue'
import { useAppStore } from '@/stores/index'
import Signal from '@/composables/signal';

// Header Setup (optional)
getCurrentInstance().proxy.$setHeader('', '', true, 'IconHome')

const router = useRouter()
const expanded = ref(null)
const user = useAppStore().getUser()
const request = useApiRequest()

// You can optionally fetch fresh data here
onMounted(async () => {
  // Example:
   const response = await request.post('entity/User/' + user.id)
   if (response.error) {
     Signal.error(response.message)
     return
   }
   user.value = response.data
})

// Sections declaration with props passed in `data`
const sections = [
  {
    key: 'user',
    title: 'User Details',
    subtitle: 'Your personal information',
    icon: '👤',
    component: UserDetails,
    data: { user }
  },
  {
    key: 'payments',
    title: 'My Payments',
    subtitle: 'Recent and past transactions',
    icon: '💳',
    component: MyPayments,
    data: { userId: user.id }
  },
  {
    key: 'account',
    title: 'Account Details',
    subtitle: 'Manage your saved payment methods',
    icon: '🏦',
    component: AccountDetails,
    data: { userId: user.id }
  },
  {
    key: 'password',
    title: 'Update Password',
    subtitle: 'Secure your account',
    icon: '🔒',
    component: UpdatePassword,
    data: { userId: user.id }
  }
]

// Current section for dynamic rendering
const currentSection = computed(() => {
  return sections.find((s) => s.key === expanded.value)
})

function toggleExpand(key) {
  expanded.value = expanded.value === key ? null : key
}

function logout() {
  router.push('/logout')
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
