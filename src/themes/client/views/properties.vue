<template>
  <section class="px-2 pb-4 drop-shadow-xl bg-white rounded-xl h-screen">
    <List :title="'Owned Properties'" :display="'list'" :owned="true" class="py-2 my-2" />
    <List :title="'Rented Properties'" :display="'list'" :description="'No properties added yet!'" :owned="false" />
  </section>
</template>

<script setup>
import List from '@/components/common/Properties.vue'
import { getCurrentInstance } from 'vue'

getCurrentInstance().proxy.$setHeader('Properties', '', true, 'IconHome')
</script>