<template>
	<!-- This is an example component -->
    <div class="max-w-2xl mx-auto">
        <div v-for="(contacts, type) in  ContactList" class="p-4 max-w-md bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">{{isStrata == 1 && type == 'Landlords' ? $t('StrataOwners') : $t(type)}}</h3>
            </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                    <li v-for="(contact, i) in  contacts" class="py-3 sm:py-4">
                        <div class="flex items-center space-x-4">
                            <div class="flex-shrink-0">
                                <img class="w-12 h-12 rounded-full" :src="'/media/'+contact.profile_picture" alt="User Profile Pic">
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">{{contact.fullname}}</p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400"><a :href="'mailto:'+ contact.email">{{contact.email}}</a></p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">{{contact.phone_no}}</p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">{{contact.address}}</p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">{{contact.address2}}</p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">{{contact.suburb}}</p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">{{contact.state}} {{contact.zipcode}}</p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">{{contact.contact_instructions}}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, watch } from 'vue'
import useApiRequest from '@/composables/request';

const props = defineProps({
    propertyId: {
        type: [String, Number],
        required: true
    }
})

let isStrata = ref(0);
let ContactList = ref([]);

watch(() => props.propertyId, (newVal) => {
	loadContacts(props.propertyId)
},{immediate:true})

const request = useApiRequest();
async function loadContacts(propertyId) {
	if (propertyId == null || propertyId == '')
		return;

	const res = await request.fetch('entity/Property/'+propertyId+'?attribs=Contacts,Strata');
    isStrata.value = res.data.Strata;
    ContactList.value = res.data.Contacts;
}

</script>

<style scoped>
	a {text-decoration:underline;}
</style>
