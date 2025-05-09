<template>

    <div class="max-w-md px-2 mx-auto bg-white rounded-3xl shadow-md overflow-hidden">
        <p class="py-2 mt-1 font-bold">{{ property.address1 }}</p>
        <Media section="property" section-type="photos"  :record-id="property.id" :edit="editProperty" />
      
    </div>
  
  </template>
  
  <script setup>
  import { ref, onMounted, getCurrentInstance } from 'vue'
  import useApiRequest from '@/composables/request'
  import Signal from '@/composables/signal'
  import { useRoute, useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/index'
  import Media from '@/components/elements/Media.vue';
  
  const route = useRoute()
  const router = useRouter()
  const { proxy } = getCurrentInstance()
  const property = ref({});
  const request = useApiRequest()
  const user = useAppStore().getUser()

  const editProperty = ref(false);

  const profile_photo = ref('')

  const propertyId = ref(route.params.id || 0)
  
  onMounted(async () => {
    proxy.$setHeader(
              `Property Photos`,
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

    

    const response = await request.post(`entity/Property/${propertyId.value}`)
    if (response.error) {
      Signal.error(response.message)
    } else {
      property.value = response.data
    }
  
    // Validate User Edit
    if (user.id == property.value.user_id) {
        editProperty.value = true;
      //Signal.error('You are not authorized to edit this property')
      //router.go(-1)
      //return
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