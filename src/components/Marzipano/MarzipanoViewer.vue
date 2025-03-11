<template>
	<div class="marzipano-viewer">
		<div class="marzipano-container">
			<div ref="panoContainer" class="pano-container"></div>
			<compass-view :yaw="state.yaw" :fov="state.fov" />
			<div class="scene-switcher fixed flex flex-row flex-nowrap items-center overflow-x-auto">
				<button v-for="scene in scenes" :key="scene" @click="switchScene(scene)" :title="scene.name"
					:class="{ 'selected': scene === selectedScene }">
					<div class="pano-thumb m-1">
						<img class="object-cover object-center h-16 w-16" :src="scene.thumbUrl" :alt="scene.name" />
					</div>
					<div class="pano-label font-bold m-1 text-center w-16 text-ellipsis text-nowrap overflow-hidden">
						{{ scene.name }}
					</div>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { MarzipanoModel } from './MarzipanoModel';
import CompassView from './CompassView.vue';

const props = defineProps({
	data: {
		type: Object,
		required: true
	},
	currentUid: {
		type: String,
		required: false
	},
	tripodImgSource: {
		type: String,
		required: false
	},
	onBeforeRenderScene: {
		type: Function,
		required: false
	},
	onAfterRenderScene: {
		type: Function,
		required: false
	},
	onClickHotspot: {
		type: Function,
		required: false
	},
	onClickNewHotspot: {
		type: Function,
		required: false
	}
});

const panoContainer = ref(null);
const state = reactive({
	yaw: 0,
	fov: 1
});
const scenes = ref([]);
const selectedScene = ref(null);

watch(scenes, (newValue, oldValue) => {
	if (scenes.value.length > 0) {
		if (props.currentUid) {
			switchSceneWithUid(props.currentUid);
		} else {
			switchScene(scenes.value[0]);
		}
	}
});

let marzipanoModel;

const initializeMarzipano = () => {
	if (!panoContainer.value) {
		console.error('panoContainer is not available');
		return;
	}
	marzipanoModel = new MarzipanoModel(panoContainer.value);
	marzipanoModel.onClickHotspot = props.onClickHotspot;
	if (marzipanoModel.onClickNewHotspot = props.onClickNewHotspot) {
		panoContainer.value.addEventListener('dblclick', (event) => {
			var coordinates = marzipanoModel.getCurrentView().screenToCoordinates({ x: event.clientX, y: event.clientY });
			coordinates['fov'] = marzipanoModel.getCurrentView().fov();
			marzipanoModel.setHotspot(coordinates, event);
		});
	}
	if (props.tripodImgSource) {
		marzipanoModel.tripodImgSource = props.tripodImgSource;
	}
	scenes.value = props.data;
};

const switchScene = async (scene) => {
	if (props.onBeforeRenderScene) {
		await props.onBeforeRenderScene(scene);
	}
	const view = await marzipanoModel.switchToScene(scene);
	if (view) {
		view.addEventListener('change', () => {
			state.yaw = view.yaw() * (180 / Math.PI);
			state.fov = view.fov() * (180 / Math.PI);
		});
	}
	selectedScene.value = scene;
	if (props.onAfterRenderScene) {
		await props.onAfterRenderScene(scene);
	}
};

const switchSceneWithUid = async (uid) => {
	let sceneObject = scenes.value.find(scene => scene.uid === uid);
	return switchScene(sceneObject);
}

onMounted(() => {
	const resizeObserver = new ResizeObserver(() => {
		if (panoContainer.value.clientWidth > 0 && panoContainer.value.clientHeight > 0) {
			initializeMarzipano()
			resizeObserver.disconnect();
		}
	});
	resizeObserver.observe(panoContainer.value);
});

defineExpose({
	switchSceneWithUid, selectedScene
});
</script>

<style>
.pano-container {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	min-height: 100px;
}

.tripod-mask {
	pointer-events: none;
	width: 500px;
	height: 500px;
}

.scene-switcher {
	width: 100vw;
	bottom: 10px;
	left: 10px;
	gap: 10px;
}

.scene-switcher button {
	background-color: #fff;
	border: none;
	cursor: pointer;
}

.scene-switcher button.selected {
	background-color: lightskyblue;
	border: 2px solid #3b82f6;
}

.hotspot .content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: stretch;
	transition: all .2s ease-in-out;
	position: absolute;
	transform: translate(-50%) translateY(-50%);
	top: 7px;
	cursor: pointer;
}

.hotspot i {
	border-radius: 50%;
	width: 34px;
	height: 34px;
	border: 3.4px solid white;
	background-color: rgb(14, 165, 233);
	color: #fff;
}

.hotspot i.comment {
	/* border: 1px solid rgba(100, 100, 100, .8); */
	border: 1px solid rgba(14, 165, 233, .8);
	border-radius: 5px;
	background-image: url("/assets/images/comment.png");
	background-size: contain;
	background-repeat: no-repeat;
}

.hotspot i.photo {
	/* border: 1px solid rgba(100, 100, 100, .8); */
	border: 1px solid rgba(14, 165, 233, .8);
	border-radius: 5px;
	background-image: url("/assets/images/photo_library.png");
	background-size: contain;
	background-repeat: no-repeat;
}

.hotspot i.pathway {
	background-image: url("/assets/images/arrow_up.png");
	background-size: contain;
	background-repeat: no-repeat;
}

.hotspot label {
	/* background-color: rgba(100, 100, 100, .8); */
	background-color: rgb(14, 165, 233, .8);
	border-radius: 3px;
	padding: 2px 5px;
	color: white;
	text-wrap: nowrap;
	border-radius: 5px;
	margin-top: 7px;
	text-align: center;
	font-size: 14px;
}
</style>
