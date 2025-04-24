<template>

  <div class="max-w-md px-2 mx-auto bg-white rounded-3xl shadow-md overflow-hidden">


    <!-- Form -->
    <div class="p-6">
      <FormKit type="form" :actions="false" v-model="property" @submit="saveProperty">
        
        <div class="grid grid-cols-1 gap-1 mb-1">
        
          <FormKit type="text" name="name" label="Property Name" validation="required" />
          <FormKit type="text" name="address1" label="Address" validation="required" />

        </div>
        <div class="grid grid-cols-2 gap-1 mb-1  ">
          
          <FormKit type="text" name="city" label="City" validation="required" />
          <FormKit type="text" name="state" label="State" validation="required" />
          <FormKit type="select" name="country" label="Country" :options="[
            { label: 'India', value: 3 },
            { label: 'Australia', value: 1 },
            { label: 'USA', value: 2 },

          ]" validation="required" />
          <FormKit type="text" name="postal_code" label="Postal Code" validation="required" />

        </div>
        <div class="grid grid-cols-2 gap-1 mb-1">
          <FormKit type="number" name="bedrooms" label="Bedrooms" min="0" />
          <FormKit type="number" name="bathrooms" label="Bathrooms" min="0" />
          <FormKit type="number" name="square_footage" label="Square Footage" min="0" />
        </div>
        <FormKit type="submit" label="Save Property" />
      </FormKit>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const property = ref({});
const request = useApiRequest()


const saveProperty = async () => {
  console.log('Saving property:', property)
  // You can now send property to API
  const response = await request.post('task/Property/save', property.value)

    if (response.error) {
        Signal.error(response.message)
        return
    }

    Signal.success('Property saved successfully')
    router.push('/properties/'+response.data.id)
}

onMounted(async () => {
  proxy.$setHeader(
            `Edit Property`,
            '',
            true,
            'IconHome'
        )
  // Fetch property data from API or store
  //propertyId.value = route.params.id
  if (!route.params.id) {
    Signal.error('Property ID is required');
    return
  }
  const response = await request.post(`entity/Property/${route.params.id}`)
  if (response.error) {
    Signal.error(response.message)
  } else {
    property.value = response.data
  }
  // Set the header for the page  
  proxy.$setHeader(
    property.value.name,
    '',
    true,
    'IconHome'
  )
})
</script>
