<template>
	<span style="display:none">{{val}}</span>
	<span v-for="(row, index) in rows" :key="index">
		<a @click="openModal(row)" class="">{{row.name}}</a>
		<span v-if="index < rows.length - 1">, </span>
		<Popup :isOpen="row.isModalOpen" @close="closeModal(row)" :title="'User Contact - ' + `${row.name}`" :data-url="'item/Users?filter_id=' + `${row.id}`">
			<template #body="{data}">
				<p>Name: {{data.name}}</p>
				<p>Email: {{data.email}}</p>
				<p>Phone: {{data.phone_no}}</p>
				<p>Mobile: {{data.mobile}}</p>
			</template>
		</Popup>
	</span>
</template>

<script setup>
import { ref, computed } from 'vue'
import Popup from '@/components/elements/Popup.vue';

const props = defineProps({
    items: {
        type: String,
        required: false,
        default() {
            return '{}'
        }
    },
    title: {
      type: String,
      default: 'User Contact'
    },
})

const rows = ref([]);
const val = computed(() => {
	rows.value = (props.items == null || props.items == '') ? [] : JSON.parse(props.items);
	return rows.value.length;
})


function openModal(row) {
	row['isModalOpen'] = true;
}

function closeModal(row) {
	row['isModalOpen'] = false;
}
</script>

<style scoped>
	a {text-decoration:underline;}
</style>
