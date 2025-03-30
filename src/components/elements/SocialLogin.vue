<template>
	<div class="w-full">
		<div v-for="social in socialList" :key="social.id"
			:class="'h-12 p-2 text-center mb-4 rounded cursor-pointer flex items-center ' + social.classes"
			@click.prevent="openLoginPage(social.id)" v-show="social.enabled">
			<Icon :name="'Icon' + social.name" class="ml-3 flex-none" fill="white" size="25" stroke="" />
			<div class="ml-5"> Continue With {{ social.name }}</div>
		</div>
	</div>
</template>

<script setup>

const props = defineProps({
	openLoginPage: {
		type: Function,
		default: () => { }
	}
});

const socialList = [
	{
		id: 'apple',
		name: 'Apple',
		classes: 'shadow-a bg-black text-white',
		enabled: false
	},
	{
		id: 'google',
		name: 'Google',
		classes: 'shadow-gg',
		enabled: true
	},
	{
		id: 'facebook',
		name: 'Facebook',
		classes: 'bg-blue-600 shadow-fb text-white',
		enabled: false
	}
];

</script>

<style>
.shadow-a {
	box-shadow: 0px 0px 2px 1px #000;
}

.shadow-fb {
	box-shadow: 0px 0px 2px 1px #1771ed;
}

.shadow-gg {
	box-shadow: 0px 0px 2px 3px #ddd;
}
</style>
