<template>
    <div>

		<FormKit type="form" @submit="fetch" submit-label="Do Magic">
			<div class="w-1/3 flex flex-wrap">
				<FormKit v-model="item.type" type="select" label="Type" outer-class="max-w-[7em]"
					:options="['entity', 'task', 'list', 'item']" />
				<FormKit v-model="item.link" type="text" label="Path" validation="required" placeholder="path.." />
			</div>

			<div class="params-list flex flex-wrap">
				<FormKit type="repeater" v-model="item.params" label="Params" add-label="+" min="0" inner-class="repeat-query">
					<template #empty>
						<h6 class="font-bold mb-4">Add extra params to use.</h6>
					</template>
					<template #default="{ index, remove }">
					  <div class="flex flex-wrap">
						<FormKit type="text" v-model="item.params[index].name" outer-class="max-w-[10em]" label="Name" />
						<FormKit type="text" v-model="item.params[index].value" outer-class="max-w-[20em]" label="Value" />
					  </div>
					</template>
				</FormKit>
			</div>
		</FormKit>

		<p><b>Spell</b>: {{url}}</p>
		
		<div v-if="error!=''" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
		  <span class="font-medium">Error!</span> {{error}}
		</div>

		<p><b>Output:</b></p>
		<pre>{{response}}</pre>
    </div>
</template>

<style>
	
	.formkit-up, .formkit-down {display:none}
	.repeat-query li {
	  background: transparent;
	  border: none;
	  box-shadow: none;
	  margin-bottom: 0;
	}
	
	.repeat-query li .formkit-content {
		padding-bottom: 0;
  		padding-top: 0.25rem;
	}
	
	ul.formkit-items {
		display: flex;
		flex-wrap: wrap;
	}
	
	ul.formkit-items li.formkit-item {
		width: 500px;
	}

	.params-list .formkit-addButton button {
	  font-size: 2em !important;
	  padding: 5px;
	  position: absolute;
	  top: 105px;
	  left: 200px;
	}
</style>


<!-- script -->
<script lang="ts" setup>
    import { reactive, ref, onMounted } from 'vue';
    import useApiRequest from '@/composables/request';
    import { useAppStore } from "@/stores/index"
    
    useAppStore().toggleFullView(1);
    
	let response = ref({});
	let error = ref('');

	const url = ref('');

	const item = ref({
		type: 'entity',
		link: '',
		params:[]
	});

	async function fetch() {
		url.value = item.value.type + "/" + item.value.link;
		let query = {};
		for (let i=0; i < item.value.params.length; i++)
		{
			query[item.value.params[i]['name']] = item.value.params[i]['value'];
		} 
		
		const request = useApiRequest();
		const out = await request.fetch(url.value, query);

		response.value = [];
		error.value = '';
		if (out.error) {
		    error.value = out.message;
		    return;
		}
		
		response.value = out.data;
	}
	
	onMounted(() => {
    	//entity();
	});

</script>
