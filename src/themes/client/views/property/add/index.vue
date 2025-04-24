<template>
    <div class="max-w-3xl mx-auto p-6 bg-white ">
        <!-- Step Indicator -->
        <StepProgress  :currentStep="currentStep" :steps="stepLabels" />

        <!-- Dynamic Step Form -->
        <!-- Add Mode (Step Form) -->
        <FormKit  type="form" :actions="false" @submit="handleStepSubmit" :key="currentStep">
            <component :is="steps[currentStep]" v-model="formData" />
            <div class="flex justify-between mt-6">
                <FormKit type="submit" label="Next" />
            </div>
        </FormKit>

       

    </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StepProgress from '../StepProgress.vue'
import StepBasic from './Basic.vue'
import StepAddress from './Address.vue'
import StepDetails from './Details.vue'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'

const steps = [StepAddress, StepBasic, StepDetails]
const stepLabels = ['Address Details', 'Basic Information', 'Property Features']
const currentStep = ref(0)
const formData = ref({})
const propertyId = ref(null)
const route = useRoute()
const router = useRouter()
const request = useApiRequest()
const { proxy } = getCurrentInstance()
const mode = ref('add')
onMounted(async () => {

    propertyId.value = route.params.id || null;
    if (mode.value === 'edit') {
        propertyId.value = route.params.id
        const response = await request.post(`entity/Property/${propertyId.value}`)
        if (response.error) {
            Signal.error(response.message)
        } else {
            formData.value = response.data
        }
        
    }
})

watchEffect(() => {
    if (mode.value === 'add') {
        proxy.$setHeader(
            `Step ${currentStep.value + 1} of ${steps.length}`,
            'Add Property',
            true,
            'IconHome'
        )
    } else {
        proxy.$setHeader('Edit Property', '', true, 'IconHome')
    }
})

const handleStepSubmit = async (formPayload) => {
    Object.assign(formData.value, formPayload)
    if (propertyId.value) formData.value.id = propertyId.value

    const response = await request.post('task/Property/save', formData.value)

    if (response.error) {
        Signal.error(response.message)
        return
    }

    if (!propertyId.value) propertyId.value = response.data.id

    if (mode.value === 'add' && currentStep.value < steps.length - 1) {
        currentStep.value++
        proxy.$setHeader(
            `Step ${currentStep.value + 1} of ${steps.length}`,
            'Add Property',
            true,
            'IconHome'
        )
    } else {
        Signal.success('Property successfully saved!')
        router.push('/dashboard')
    }
}

const prevStep = () => {
    if (currentStep.value > 0) currentStep.value--
}
</script>