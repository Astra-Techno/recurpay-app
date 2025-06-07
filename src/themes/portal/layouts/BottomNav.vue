<template>
  <nav class="flex justify-around items-center h-16 w-full max-w-[390px] bg-white border-t border-[#E8EBF2] shadow backdrop-blur-md ">
    <RouterLink
      v-for="item in navItems"
      :key="item.label"
      :to="item.to"
      class="flex flex-col items-center justify-center text-xs transition-all duration-150 ease-in-out"
      :class="[
        isActive(item.to)
          ? 'font-medium'
          : ' hover:text-blue-500'
      ]"
    >
      <component :is="item.icon" class="w-6 h-6 mb-1" />
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  CreditCard,
  UserIcon,
  SearchCheck,
  MoreHorizontalIcon,
  List
} from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { label: 'Home', to: '/dashboard', icon: HomeIcon },
  { label: 'Services', to: '/services', icon: List },
  { label: 'Payments', to: '/payments', icon: CreditCard },
  { label: 'Explore', to: '/explore', icon: SearchCheck },
  { label: 'Profile', to: '/profile', icon: UserIcon },
]

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')
</script>
