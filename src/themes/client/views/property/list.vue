<template>
    <section class="px-4 pb-4  bg-white rounded-xl h-screen">
      <List class="py-2 my-2" :display="'list'" :pagination="true" :pageLimit="5" :title="title" :description="'No properties added yet!'" :owned="owned" />      
    </section>
  </template>
  
  <script setup>
  import List from '@/components/common/Properties.vue'
  import { getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'

    const route = useRoute()
    const mode = route.params.mode || 'list'  

    const title = computed(() => {
      return mode === 'owned' ? 'My Properties' : 'Rented Properties'
    })

    const owned = computed(() => {
      return mode === 'owned'
    })

  getCurrentInstance().proxy.$setHeader(title, '', true, 'IconHome')
  </script>