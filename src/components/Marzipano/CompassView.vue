<template>
  <div class="compass-container">
	<svg compass-20="" height="20" width="20" viewBox="0 0 20 20">
		<circle compass-20="" r="9" cx="10" cy="10" stroke="white" stroke-width="1" fill="none"></circle>
		<circle compass-20="" r="2" cx="10" cy="10" fill="white"></circle>
		<circle compass-20="" :style="{ transform: `rotateZ(${-90 - (.5 * fov) + yaw}deg)`, transformOrigin: `center` }" :stroke-dasharray="`${31.4 * fov / 360} 31.4`" r="5" cx="10" cy="10" fill="transparent" stroke="white" stroke-width="6"></circle>
	</svg>
  </div>
</template>

<script setup>
const {yaw, fov} = defineProps({
	yaw: {
		type: Number,
		required: true
	},
	fov: {
		type: Number,
		required: true
	}
})
</script>

<style>
.compass-container {
	position: absolute;
	top: 10em;
	right: 10px;
	background: rgba(0, 0, 0, 0.5);
	color: white;
	border-radius: 50%;
	width: 40px;
	height: 40px;
}

svg[compass-20] {
	width: 100%;
	height: 100%;
}

</style>