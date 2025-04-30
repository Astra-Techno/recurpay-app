<template>
  <!-- Top Profile Header -->
  <div class="bg-white shadow-sm px-4 py-6 flex items-center gap-4">
    <img
      class="w-12 h-12 rounded-full object-cover"
      src="https://i.pravatar.cc/150?img=5"
      alt="Profile"
    />
    <div class="flex-1">
      <p class="font-semibold text-gray-800 truncate">{{ user.name }}</p>
      <p class="text-xs text-gray-500">Account Details</p>
    </div>
    <router-link :to="{ name: 'EditProfile' }">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </router-link>
  </div>

  <!-- Expandable Profile Sections -->
  <div class="divide-y divide-gray-200">
    <ProfileItem icon="👤" label="Basic Details" section="basic" :isActive="activeSection === 'basic'" @open="openSection" />
    <ProfileItem icon="🏦" label="Payment Methods" section="payment" :isActive="activeSection === 'payment'" @open="openSection" />
    <ProfileItem icon="🆔" label="KYC Verification" section="kyc" :isActive="activeSection === 'kyc'" @open="openSection" />
    <div @click="logout" class="bg-white px-4 py-4 flex justify-between items-center hover:bg-red-50">
      <div class="flex items-center gap-3 text-red-600 font-semibold">
        <span>🚪</span>
        <span>Logout</span>
      </div>
    </div>
  </div>

  <!-- Render section content if active -->
  <ProfileSection v-if="activeSection" :section="activeSection" @close="activeSection = ''" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProfileItem from '@/components/profile/ProfileItem.vue'
import ProfileSection from '@/components/profile/ProfileSection.vue'

const router = useRouter()
const activeSection = ref('')

const user = {
  name: 'Shanmugakani Vignesh'
}

function openSection(section) {
  activeSection.value = section
}

function logout() {
  router.push('/logout')
}
</script>
