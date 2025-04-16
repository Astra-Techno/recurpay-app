<template>
    <div class="py-4">        
        <!-- Main Page Heading -->
        <div class="mb-6 ">
            <div class="flex items-center  gap-2">

                <span class="inline-block bg-blue-100 text-blue-600 p-2 rounded-full">
                    🏠
                </span>
                <h2 class="text-3xl font-black italic">Add Tenant</h2>
            </div>
            <p class="text-gray-500 text-sm mt-1">to {{ property.name || 'Property' }}</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
            <!-- Form -->
            <FormKit v-if="!loading" type="form" @submit="submitForm" v-model="tenant" submit-label="Save"
                submit-class="btn-primary" :actions="true"
                :config="{ classes: { form: 'space-y-4', submit: { input: 'btn btn-primary' } } }">                
                
                    <FormKit type="text" name="name" label="Name" help="Please enter full name" validation="required" />
                    <FormKit type="mask" name="phone" mask="🇮🇳 +91 ##### #####" label="Phone"
                        help="Please enter a phone number" validation="required" />
                

            </FormKit>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import useApiRequest from '@/composables/request'

import Signal from '@/composables/signal'
import { useMeta } from '@/composables/use-meta';
useMeta({ title: 'Add Tenant' })
const emit = defineEmits(['submitted'])
const router = useRouter();
const request = useApiRequest();

const tenant = ref({
    id: 0,
    name: '',
    phone: '',
    property_id: 0
   
});

const props = defineProps({
    property: {
        type: Object,
        required: true,
    }
});
// Country codes for phone input
const countryCodes = ref([
    { label: '🇮🇳 +91', value: '+91' },
    { label: '🇺🇸 +1', value: '+1' },
    { label: '🇬🇧 +44', value: '+44' },
    // Add more country codes as needed
]);
const submitForm = async () => {
    tenant.value.property_id = props.property.id;
    const response = await request.post('task/Tenant/save', tenant.value);
    if (response.error) {
        Signal.error(response.message);
        return;
    }
    // Save returned ID once on first save
    if (!tenant.value.id) tenant.value.id = response.data.id;   

    // Show success message
    Signal.success('Tenant added successfully!');
    emit('submitted')
};
</script>