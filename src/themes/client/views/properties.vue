<template>
  <section class="px-2 pb-4 drop-shadow-xl bg-white rounded-xl h-screen">
    <List class="py-2 my-2" :title="'My Properties'" :description="'No properties added yet!'" :owned="true" />
    <List :title="'Rented Properties'" :description="'No properties added yet!'" :owned="false" />
  </section>
</template>

<script setup>
import List from '@/components/common/Properties.vue'
import { getCurrentInstance } from 'vue'

getCurrentInstance().proxy.$setHeader('Properties', '', true, 'IconHome')
</script>