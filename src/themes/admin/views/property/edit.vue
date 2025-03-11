<template>
	<!--
		<div class="grid grid-cols-4 gap-3">
			
		    <Card class="min-w-32"></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>  
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>
		    <Card></Card>               
		</div>
	-->
    <div>

		<FormKit type="form" #default="{ value }" @submit="fetch" submit-label="Fetch" 
			:config="{
				classes: {
					outer: '$remove:min-w-[5em] min-w-[10em] max-w-[10em]'
				}
			}">
				<div class="w-1/2 flex flex-wrap">
					<FormKit v-model="item.type" type="select" label="Type"  
						:options="['entity', 'task', 'list', 'item']" />
					<FormKit v-model="item.link" type="text" label="Path" validation="required" />
					
					<FormKit v-model="item.type" outer-class="relative text-black-dark $remove:max-w-[5em] max-w-[30em]" type="select" label="Type"  
						:options="['entity', 'task', 'list', 'item']" />
					<FormKit v-model="item.link" type="text" label="Path" validation="required" />

					<FormKit v-model="item.type" type="select" label="Type"  
						:options="['entity', 'task', 'list', 'item']" />
					<FormKit v-model="item.link" type="text" label="Path" validation="required" />
					
					<FormKit v-model="item.type" type="select" label="Type"  
						:options="['entity', 'task', 'list', 'item']" />
					<FormKit v-model="item.link" type="text" label="Path" validation="required" />

					<FormKit v-model="item.type" type="select" label="Type"  
						:options="['entity', 'task', 'list', 'item']" />
					<FormKit v-model="item.link" type="text" label="Path" validation="required" />
					
					<FormKit v-model="item.type" type="select" label="Type"  
						:options="['entity', 'task', 'list', 'item']" />
					<FormKit v-model="item.link" type="text" label="Path" validation="required" />

					<FormKit v-model="item.type" type="select" label="Type"  
						:options="['entity', 'task', 'list', 'item']" />
					<FormKit v-model="item.link" type="text" label="Path" validation="required" />
					
					<FormKit v-model="item.type" type="select" label="Type"  
						:options="['entity', 'task', 'list', 'item']" />
					<FormKit v-model="item.link" type="text" label="Path" validation="required" />															
				</div>

			
			<FormKit id="repeater" name="item.params" type="repeater" label="Params" draggable="true" #default="{ index }">
				<div class="double">
					<FormKit name="name" type="text" label="Name" validation="required" />
					<FormKit name="value" type="text" label="Value" validation="required" />
				</div>
			</FormKit>
		</FormKit>

		<pre>{{item}}</pre>
		<pre>{{response}}</pre>
    </div>
</template>

<style>
	.double {
	  display: flex;
	  justify-content: space-between;
	}

	.double > *:first-child {
	  margin-right: 1em;
	}
</style>


<!-- script -->
<script lang="ts" setup>
    import { reactive, ref, onMounted } from 'vue';
    import Card from '@/components/elements/Card.vue';
    import useApiRequest from '@/composables/request';
	let response = ref({});

	const item = reactive({
		type: '',
		link: '',
		params:[]
	});

	async function fetch() {
		const request = useApiRequest();
		const out = await request.fetch('/Property/9827?attr=all');
		response.value = out.data;
	}
	
	onMounted(() => {
    	//entity();
	});

</script>
