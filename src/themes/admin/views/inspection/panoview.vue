<template>
	<div class="flex flex-col flex-nowrap w-full h-screen">
		<navbar class="flex flex-col">
			<template #center>
				<div v-if="marziPanoComp">
					<div v-if="general.type"
						class="text-base sm:text-lg md:text-xl text-center font-semibold dark:text-white-light">
						{{ general.type }}&nbsp;-&nbsp;{{ general.address }}
					</div>
					<div v-if="marziPanoComp.selectedScene"
						class="text-base sm:text-lg md:text-xl text-center font-semibold dark:text-white-light">
						{{ marziPanoComp.selectedScene.name }}</div>
				</div>
			</template>
			<template #right>
				<!--<div v-if="general.completed">
					<span class="text-l dark:text-white-light">{{general.completed}}</span>
				</div>-->
				<button :class="isInfoPanelVisible ? 'bg-white/50 p-1.5 rounded-full' : ''">
					<iconListCheck class="text-white" :width="25" :height="25" @click="toggleInfoPanel" />
				</button>
			</template>
		</navbar>
		<div class="grow z-10 pointer-events-none relative">
			<loader :loading="isLoading"></loader>
			<popup :isOpen="isModalVisible" :title="modalTitle" @close="closeModal">
				<template #body="">{{ modalMessage }}</template>
			</popup>
			<div v-if="currentRoom" :class="isInfoPanelVisible ? 'w-full max-w-full md:w-96' : 'w-0 max-w-0 md:w-0'"
				class="transition-all ease-in-out duration-200 h-full absolute right-0 z-10 pointer-events-auto overflow-x-hidden overflow-y-auto bg-white/75"
				style="box-shadow: 0 2px 4px -1px #0003,0 4px 5px #00000024,0 1px 10px #0000001f">
				<div v-if="currentRoom.smoke_alarm" class="m-2.5">
					<div class="font-semibold">Smoke Alarm</div>
					<div class="bg-white/80 rounded p-1.5 my-1.5">
						<div class="flex gap-2">
							<img class="object-cover object-center h-10 w-10 flex-none rounded"
								:src="currentRoom.smoke_alarm.media_thump" :alt="currentRoom.smoke_alarm.id" />
							<div class="flex-auto">
								<div class="table w-full">
									<div class="table-row">
										<span class="table-cell w-12">Type</span>
										<label class="table-cell">{{ currentRoom.smoke_alarm.prefix.smoke_type_text
											}}</label>
									</div>
									<div class="table-row">
										<span class="table-cell w-12">Expiry</span>
										<label class="table-cell">{{ currentRoom.smoke_alarm.prefix.exp_month }} / {{
											currentRoom.smoke_alarm.prefix.exp_year }}</label>
									</div>
								</div>
							</div>
						</div>
						<p class="mt-1">{{ currentRoom.smoke_alarm.message }}</p>
					</div>
				</div>
				<div v-if="currentRoom.reminder" class="m-2.5">
					<div class="font-semibold">Reminder</div>
					<div class="flex bg-white/80 rounded p-1.5 my-1.5">
						<p>{{ currentRoom.reminder.message }}</p>
					</div>
				</div>
				<div v-if="currentRoom.photos.length > 0" class="m-2.5">
					<div class="font-semibold"><span>Photos</span><span
							class="m-1 inline-flex items-center rounded-md bg-blue-50 px-1 text-xs text-blue-700 ring-1 ring-inset ring-blue-700/10 font-bold">{{
								currentRoom.photos.length }}</span>
					</div>
					<div class="flex flex-nowrap overflow-auto gap-2 my-1.5">
						<div class="flex-none cursor-pointer border-2 border-white"
							v-for="(photo, index) of currentRoom.photos" :key="photo.id">
							<img class="object-cover object-center h-16 w-16" :src="photo.media_thump" :alt="photo.id"
								@click="currentRoom.clickPhoto(index)" />
						</div>
					</div>
				</div>
				<div v-if="currentRoom.comments.length > 0" class="m-2.5">
					<div class="font-semibold">Comments</div>
					<p v-for="comment of currentRoom.comments" :key="comment.id"
						class="p-1.5 my-1.5 bg-white/80 rounded">
						{{ comment.message }}
					</p>
				</div>
				<div v-if="currentRoom.notes.length > 0" class="m-2.5">
					<div class="font-semibold">Notes</div>
					<p v-for="note of currentRoom.notes" :key="note.id" class="p-1.5 my-1.5 bg-white/80 rounded">
						{{ note.message }}
					</p>
				</div>
				<div v-if="currentRoom.features.length > 0" class="m-2.5">
					<div class="font-semibold">Features</div>
					<div class="flex flex-col">
						<div v-for="feature of currentRoom.features" :key="feature.id">
							<div class="p-2 rounded-md my-1.5 bg-white/80">
								<div class="text-lg">{{ feature.feature_name }}</div>
								<div class="grid grid-cols-3 gap-2 py-2">
									<div class="flex flex-col items-center">
										<icon-circle-check v-if="feature.clean > 0" class="fill-green-200" />
										<icon-x-circle v-else class="fill-red-400" />
										<div class="text-xs">Clean</div>
									</div>
									<div class="flex flex-col items-center">
										<icon-circle-check v-if="feature.undamaged > 0" class="fill-green-200" />
										<icon-x-circle v-else class="fill-red-400" />
										<div class="text-xs">Undamaged</div>
									</div>
									<div class="flex flex-col items-center">
										<icon-circle-check v-if="feature.working > 0" class="fill-green-200" />
										<icon-x-circle v-else class="fill-red-400" />
										<div class="text-xs">Working</div>
									</div>
								</div>
								<div class="">
									<div v-if="feature.photos.length > 0" class="p-0">
										<div class="font-semibold">
											<span>Photos</span>
											<span
												class="m-1 inline-flex items-center rounded-md bg-blue-50 px-1 text-xs text-blue-700 ring-1 ring-inset ring-blue-700/10 font-bold">{{
													feature.photos.length }}</span>
										</div>
										<div class="flex flex-nowrap overflow-auto gap-2 my-1.5">
											<div class="flex-none cursor-pointer border-2 border-white"
												v-for="(photo, index) of feature.photos" :key="photo.id">
												<img class="object-cover object-center h-16 w-16"
													:src="photo.media_thump" :alt="photo.id"
													@click="feature.clickPhoto(index)">
											</div>
										</div>
									</div>
									<div v-if="feature.comments.length > 0" class="mt-2.5">
										<div class="font-semibold">Comments</div>
										<p v-for="comment of feature.comments" :key="comment.id"
											class="p-1.5 my-1.5 bg-white rounded">
											{{ comment.message }}
										</p>
									</div>
									<div v-if="feature.notes.length > 0" class="mt-2.5">
										<div class="font-semibold">Notes</div>
										<p v-for="note of feature.notes" :key="note.id"
											class="p-1.5 my-1.5 bg-white border rounded">
											{{ note.message }}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<marzipano-viewer v-if="scenes.length > 0" ref="marziPanoComp" :data="scenes" :tripod-img-source="agency.logo"
			:on-before-render-scene="onBeforeRenderScene" :on-after-render-scene="onAfterRenderScene"
			:on-click-hotspot="handleHotspotClick" :current-uid="route.query.uid" />
	</div>
</template>

<style>
.pswp--touch .pswp__button--arrow {
	visibility: visible;
}
</style>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useMeta } from '@/composables/use-meta';
import { useRouter, useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue';
import Loader from '@/components/elements/Loader.vue';
import Signal from '@/composables/signal';
import MarzipanoViewer from '@/components/Marzipano/MarzipanoViewer.vue';
import useApiRequest from '@/composables/request'
import Popup from '@/components/elements/Popup.vue';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import iconCircleCheck from '@/components/icon/icon-circle-check.vue';
import iconXCircle from '@/components/icon/icon-x-circle.vue';
import iconListCheck from '@/components/icon/icon-list-check.vue';

useMeta({ title: 'Inspection: 360° View' })
const route = useRoute()
const request = useApiRequest()
const isLoading = ref(false)
const agency = ref({})
const general = ref({})
const rooms = ref([])
const features = ref([])
const scenes = ref([])
const subitems = ref({})
const marziPanoComp = ref(null)
const currentRoom = ref(null)

const isModalVisible = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const closeModal = () => {
	isModalVisible.value = false
};

const isInfoPanelVisible = ref(false)
const toggleInfoPanel = () => {
	isInfoPanelVisible.value = !isInfoPanelVisible.value
}
watch(isInfoPanelVisible, (newValue, oldValue) => {
	const compasses = document.querySelectorAll('.compass-container');
	compasses.forEach(compass => {
		if (newValue) {
			compass.style.right = '24.5rem'
		} else {
			compass.style.right = '10px'
		}
	})
});

const handleHotspotClick = (event, hotspot) => {
	console.log(hotspot);
	if (hotspot.type == 'pathway') {
		pathwayHotspot(hotspot)
	}
	if (hotspot.type == 'photo') {
		photoHotspot(hotspot)
	}
	if (hotspot.type == 'comment') {
		commentHotspot(hotspot)
	}
};

const commentHotspot = function (hotspot) {
	if (!hotspot.linked_uids || !hotspot.linked_uids.length) {
		Signal.error('Hotspot linked reference is empty');
		return
	}

	if (!Object.keys(subitems.value).length) {
		Signal.error('Subitems are empty');
		return
	}

	let linked_uid = hotspot.linked_uids[0];
	let subitem = subitems.value[linked_uid];
	modalTitle.value = hotspot.name;
	modalMessage.value = subitem.message;
	isModalVisible.value = true;
}

const pathwayHotspot = function (hotspot) {
	if (!hotspot.linked_uids || !hotspot.linked_uids.length) {
		Signal.error('Hotspot linked reference is empty');
		return
	}

	if (marziPanoComp.value)
		marziPanoComp.value.switchSceneWithUid(hotspot.linked_uids[0])
}

const photoHotspot = function (hotspot) {
	if (!hotspot.linked_uids || !hotspot.linked_uids.length) {
		Signal.error('Hotspot linked references are empty');
		return
	}

	if (!Object.keys(subitems.value).length) {
		Signal.error('Subitems are empty');
		return
	}

	let assets = []
	hotspot.linked_uids.forEach((linked_uid, index) => {
		if (subitems.value[linked_uid]) {
			let subitem = subitems.value[linked_uid];
			let tmpAsset = {
				src: subitem.media,
				html: subitem.message,
				width: subitem.width || 1280,
				height: subitem.height || 720
			}
			assets.push(tmpAsset);
		}
	});
	/*
	const options = {
		dataSource: assets,
		showHideAnimationType: 'none'
	};
	const pswp = new PhotoSwipe(options);
	pswp.init();
	*/
	showPhotoSwipeLightbox(assets, 0, hotspot.name)
}

const preloadImage = function (url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('Image failed to load: ' + url));
		img.src = url;
	});
}

const onBeforeRenderScene = async (scene) => {
	isLoading.value = true
	await preloadImage(scene.imageUrl)
		.then((image) => {
			//console.log(image.src);
		})
		.catch((error) => {
			console.error(error);
		});
	isLoading.value = false
}

const onAfterRenderScene = async (scene) => {
	try {
		if (window.innerWidth > 768) {
			currentRoom.value = findRoomBySubUid(scene.uid);
			isInfoPanelVisible.value = currentRoom.value.hasInfo
		}
		if (route.query.uid != scene.uid) {
			updateQueryParamWithoutState('uid', scene.uid)
		}
	} catch (error) {
		Signal.error(error);
		return
	}
}

const updateQueryParamWithoutState = function (param, paramValue) {
	const url = new URL(window.location.href)
	url.searchParams.set(param, paramValue)
	window.history.replaceState({}, '', url)
}

const showPhotoSwipeLightbox = function (assets, index = 0, title = '') {
	const options = {
		dataSource: assets,
		showHideAnimationType: 'none',
		wheelToZoom: true,
		loop: false,
		arrowKeys: true,
		pswpModule: () => import('photoswipe')
	};
	const lightbox = new PhotoSwipeLightbox(options);
	lightbox.on('contentAppend', (e) => {
		if (e.content.type === 'video' && e.content.data.html) {
			if (e.content.element) {
				e.content.element.innerHTML = e.content.data.html;
			} else {
				// Fallback: Handle cases where the element is still undefined
				console.error('Content element is undefined.');
			}
		}
	});
	if (title) {
		lightbox.on('uiRegister', function () {
			lightbox.pswp.ui.registerElement({
				name: 'title-indicator',
				className: 'flex items-center',
				html: '<div class="bg-sky-500 rounded-full font-semibold text-white px-5 py-2 mx-2.5">' + title + '</div>'
			});
		});
	}
	lightbox.init();
	lightbox.loadAndOpen(index);
}

const formatAsset = function (assetItem) {
	const asset = {
		src: assetItem.media,
		html: assetItem.message,
		width: assetItem.width || 1280,
		height: assetItem.height || 720,
		type: 'image'
	}

	if (assetItem.media.includes('.mp4')) {
		asset.type = 'video'
		asset.html = '<video style="height: 100%; margin: 0 auto" controls><source src="' + assetItem.media + '" type="video/mp4"></video>'
	}

	return asset
}

const SubItem = (uid) => {
	const subitem = subitems.value[uid] || null;
	if (!subitem)
		throw new Error('Unable to find the subitem by reference')
	return subitem;
}

const Room = (uid) => {
	const room = rooms.value[uid] || null
	if (!room)
		throw new Error('Unable to find the room by reference')
	room.features = []
	if (room.feature_uids)
		room.features = room.feature_uids.map(uid => Feature(uid))
	room.assets = []
	room.photos = []
	if (room.sub_room_photo)
		room.photos.push(...room.sub_room_photo.map(uid => SubItem(uid)))
	if (room.sub_room_addphoto)
		room.photos.push(...room.sub_room_addphoto.map(uid => SubItem(uid)))
	room.comments = []
	if (room.sub_room_comment)
		room.comments.push(...room.sub_room_comment.map(uid => SubItem(uid)))
	room.notes = []
	if (room.sub_room_note)
		room.notes.push(...room.sub_room_note.map(uid => SubItem(uid)))
	room.smoke_alarm = null
	if (room.sub_room_smoke)
		room.smoke_alarm = SubItem(room.sub_room_smoke[0])
	room.reminder = null
	if (room.sub_room_reminder)
		room.reminder = SubItem(room.sub_room_reminder[0])
	room.clickPhoto = function (index) {
		if (!room.assets.length) {
			room.assets.push(...room.photos.map(formatAsset))
		}
		showPhotoSwipeLightbox(room.assets, index, room.room_name)
	}
	room.hasInfo = room.photos.length > 0 || room.comments.length > 0 || room.notes.length > 0 || room.smoke_alarm || room.reminder || room.features.length > 0;
	return room;
}

const Feature = (uid) => {
	const feature = features.value[uid] || null
	if (!feature)
		throw new Error('Unable to find the feature by reference')
	feature.assets = []
	feature.photos = []
	if (feature.sub_feature_addphoto)
		feature.photos = feature.sub_feature_addphoto.map(uid => SubItem(uid))
	feature.comments = []
	if (feature.sub_feature_comment)
		feature.comments.push(...feature.sub_feature_comment.map(uid => SubItem(uid)))
	feature.notes = []
	if (feature.sub_feature_note)
		feature.notes.push(...feature.sub_feature_note.map(uid => SubItem(uid)))
	feature.clickPhoto = function (index) {
		if (!feature.assets.length) {
			feature.assets.push(...feature.photos.map(formatAsset))
		}
		showPhotoSwipeLightbox(feature.assets, index, feature.feature_name)
	}
	return feature;
}

const findRoomBySubUid = (sub_uid) => {
	const subitem = SubItem(sub_uid)
	const room = Room(subitem.key)
	return room;
}

const bindData = (data) => {
	if (!data.scenes) {
		throw new Error('There is no 360 photos to load')
	}
	({ agency: agency.value, general: general.value, scenes: scenes.value, rooms: rooms.value = [], features: features.value = [], subitems: subitems.value = [] } = data);
}

const fetchData = async () => {
	try {
		let query = route.query
		if (!query.id)
			throw new Error('Empty id not allowed')
		const response = await request.post('guest-task/Inspection/fetchData', query);
		if (response.error)
			throw new Error(response.error)
		if (!response.data)
			throw new Error('Invalid response on inspection fetch data')
		bindData(response.data);
	} catch (error) {
		Signal.error(error)
	}
}

onMounted(() => {
	fetchData()
})
</script>
