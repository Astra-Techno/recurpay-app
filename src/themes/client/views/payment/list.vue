<template>
    <section class="px-4 pb-4  bg-white rounded-xl h-screen">
      <List class="py-2 my-2" :status="status" :property-id="property_id" :display="'list'" :pagination="true" :pageLimit="8" title="Payments" :description="'No Payments Added yet'"/>      
    </section>
  </template>
  
  <script setup>
  import List from '@/components/common/DuePayments.vue'
  import { getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'  
   const route = useRoute()
   const property_id = route.params.property_id || 0    
   const status = route.params.status || 'all'

  getCurrentInstance().proxy.$setHeader('Payments', '', true, 'IconHome')
  </script>