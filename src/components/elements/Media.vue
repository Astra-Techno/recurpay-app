<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import axios from 'axios';
import useApiRequest from '@/composables/request';
import Signal from '@/composables/signal';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import Icon from '@/components/elements/Icon.vue'
const request = useApiRequest();
// Use `defineModel()` to bind `v-model`
const modelValue = defineModel();
// Receive FormKit context
const props = defineProps({
	section: String,
	sectionType: String,
	recordId: Number,
	modelValue: String, // v-model binding
	edit: {
		type: Boolean,
		default: false
	}
});
const emit = defineEmits(["update:modelValue"]);
// Extract props from FormKit `context`
const section = ref(props.section || '');
const sectionType = ref(props.sectionType || '');
const recordId = computed(() => Number(props.recordId) || 0);
const edit = computed(() => props.edit);

// Upload configurations
const uploadLimit = ref(0);
const allowedFormats = ref('');
const name = ref(''); // Name of the field
const mediaTypeId = ref(0);
const files = ref([]);
const fileInput = ref(null);
let lightbox = null;
// Generate Unique Upload Token
const generateToken = () => Math.random().toString(36).substr(2, 9) + '-' + Date.now();
// Set initial tokenId
const tokentId = generateToken();
/*if (!modelValue.value) {
	modelValue.value = generateToken();
}*/
// Load media type when component is mounted
onMounted(() => {
	loadMediaType();	
});

watch(() => props.recordId, (newId) => {
	if (newId) {
		loadMediaType(); // Reset to the first page and reload data
	}
});

// Load media type based on `section` and `sectionType`
async function loadMediaType() {
	if (!section.value || !sectionType.value) return;
	const params = `media_type=${sectionType.value}&media_section=${section.value}&base=1&attrib=files&record_id=${recordId.value}`;
	const response = await request.fetch(`entity/SystemMediaType?${params}`);
	if (response.error) {
		console.error('MediaType load error:', response.message);
		return;
	}
	mediaTypeId.value = response.data.id;
	uploadLimit.value = response.data.max_upload_size;
	allowedFormats.value = response.data.allowed_formats;
	name.value = response.data.name;
	files.value = [];
	for (var i in response.data.files) {
		const fileObj = ref(response.data.files[i]);
		fileObj.value.progress = 100;
		fileObj.value.type = 'A';
		fileObj.value.mediaTypeId = mediaTypeId.value;
		fileObj.value.section = section.value;
		fileObj.value.sectionType = sectionType.value;
		fileObj.value.tokentId = tokentId;
		files.value.push(fileObj);
	}
}
// Open file dialog
const triggerFileSelect = () => {
	fileInput.value.click();
};
// Handle file selection
const handleFileSelect = (event) => {
	uploadFiles(Array.from(event.target.files));
};
// Handle file drop
const handleDrop = (event) => {
	event.preventDefault();
	uploadFiles(Array.from(event.dataTransfer.files));
};
// Upload files with progress tracking
const uploadFiles = (selectedFiles) => {
	selectedFiles.forEach(uploadFile);
};
const uploadFile = (file) => {
	const formData = new FormData();
	formData.append('mediaTypeId', mediaTypeId.value);
	formData.append('section', section.value);
	formData.append('sectionType', sectionType.value);
	formData.append('recordId', recordId.value);
	formData.append('tokenId', tokentId);
	formData.append('file', file);
	const source = axios.CancelToken.source();
	const fileObject = ref({
		name: file.name,
		size: file.size,
		progress: 0,
		cancelToken: source,
	});
	files.value.push(fileObject);
	request.post('task/Media/upload', formData, {
		cancelToken: fileObject.value.cancelToken.token,
		headers: { 'Content-Type': 'multipart/form-data' },
		onUploadProgress: (progressEvent) => {
			fileObject.value.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
		},
	}).then((response) => {
		if (response.error) {
			Signal.error(response.message);
			return;
		}
		fileObject.value.media_id = response.data.media_id;
		fileObject.value.path = response.data.path;
		fileObject.value.type = response.data.type;
		emit("update:modelValue", tokentId);
		Signal.success(`File (${fileObject.value.name}) uploaded successfully!`);
	});
};
// Cancel an ongoing upload
const cancelUpload = (file, index) => {
	file.value.cancelToken.cancel('Upload canceled by user!');
	files.value.splice(index, 1);
};
// Remove a completed upload
const removeFile = (file, index) => {
	Signal.confirm("Are you sure?", "You won't be able to revert this!", "Yes, delete it!").then((result) => {
		if (result.isConfirmed) {
			request.post('task/Media/delete', { ...file.value, tokenId: modelValue.value }).then((response) => {
				if (response.error) {
					Signal.error(response.message);
					return;
				}
				files.value.splice(index, 1);
				Signal.success(`File (${file.value.name}) deleted successfully!`);
			});
		}
	});
};
// Format file size
const formatFileSize = (size) => `${(size / (1024 * 1024)).toFixed(2)} MB`;
// Function to load an image and get its original dimensions
const getImageSize = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = src;
  });
};
// Function to get the correct image URL
const getImageUrl = (path) => {
  return path.startsWith("http") ? path : `/media/${path}`;
};
// Open viewer when clicking on an image
const openViewer = async (index, event) => {
  event.preventDefault(); // Stop default click behavior
  console.log("Clicked Image Index:", index);
  if (!files.value[index]?.value?.path) {
    console.warn("No image path found for file at index", index);
    return;
  }
 try {
    // Fetch the clicked image's original size first (to avoid delay)
    const clickedFile = files.value[index];
    const clickedSrc = getImageUrl(clickedFile.value.path);
    console.log("Clicked image URL:", clickedSrc);
    const { width, height } = await getImageSize(clickedSrc);
    // Set up slides but use placeholder sizes for other images (faster)
    let slides = files.value.map((file, i) => ({
      src: getImageUrl(file.value.path),
      w: i === index ? width : 800, // Use actual size for clicked image
      h: i === index ? height : 600,
    }));
    // Destroy and reinitialize the lightbox
    if (lightbox) {
      lightbox.destroy();
    }
    lightbox = new PhotoSwipeLightbox({
      dataSource: slides,
	  wheelToZoom: true,
      index: index,
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();
    lightbox.loadAndOpen(index);
    // After opening, update the dimensions for other images asynchronously
    slides = await Promise.all(
      files.value.map(async (file, i) => {
        const src = getImageUrl(file.value.path);
        const { width, height } = await getImageSize(src);
        return { src, w: width, h: height };
      })
    );
    // Update lightbox with correct dimensions
    lightbox.options.dataSource = slides;
  } catch (error) {
    console.error("Error opening viewer:", error);
  }
};
const downloadPDF = () => {
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = "file.pdf"; // Name of the downloaded file
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const isImage = (path) => {
  if (!path) return false;
  const ext = path.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
};
</script>
<template>
	<div>
	  <!-- Preview / Display Section -->
	  <div v-if="files.length" id="gallery" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		<div 
		  v-for="(file, index) in files" 
		  :key="index" 
		  class="relative group rounded-xl overflow-hidden shadow-md bg-white">
  
		  <!-- Image Display -->
		  <img v-if="file.value.path && isImage(file.value.path)"
			:src="getImageUrl(file.value.path)"
			alt="Uploaded"
			class="w-full h-32 object-cover cursor-pointer"
			@click="openViewer(index, $event)"
		  />
  
		  <!-- Non-image Display -->
		  <div v-else class="p-6 flex justify-center items-center">
			<a :href="getImageUrl(file.value.path)" download>
			  <Icon name="FileText" size="40" class="text-blue-500 hover:text-blue-600" />
			</a>
		  </div>
  
		  <!-- Action Icons -->
		  <div class="absolute top-2 right-2 flex space-x-2">
			<Icon name="CircleX" size="20" class="text-red-500 hover:text-red-600 cursor-pointer" @click.stop="removeFile(file, index)" />
		  </div>
  
		  <!--
		  <div class="px-3 py-2 text-xs text-gray-500">
			<p>Added by: {{ file.value.author }}</p>
			<p>{{ file.value.created }}</p>
		  </div>
		  -->
		</div>
	  </div>
  
	  <!-- Empty State -->
	  <div v-else class="text-center text-gray-400 py-6">
		<p v-if="name === 'job_images'">No images or videos uploaded.</p>
		<p v-else>No files uploaded.</p>
	  </div>
  
	  <!-- Upload Form -->
	  <div class="mt-6" v-if="edit">
		<label class="block text-sm font-semibold text-gray-700 mb-2">{{ $attrs.label }}</label>
		<div @dragover.prevent @drop="handleDrop" class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 border-blue-200 bg-blue-50">
		  <input type="file" @change="handleFileSelect" ref="fileInput" hidden multiple />
		  <div @click="triggerFileSelect">
			<Icon name="UploadCloud" class="mx-auto text-blue-400" size="32" />
			<p class="text-sm font-semibold mt-2">Click or drag files here to upload</p>
			<p class="text-xs text-gray-500 mt-1">{{ allowedFormats }} | Max size: {{ uploadLimit }}MB</p>
		  </div>
		</div>
	  </div>
  
	  <!-- Slot for Custom Display -->
	  <div class="mt-4">
		<slot />
	  </div>
	</div>
  </template>
<style scoped>
.upload-component {
	max-width: 400px;
	border: 2px dashed #ccc;
	padding: 20px;
	text-align: center;		
	border-color: var(--button-primary-outline);
}
.upload-box {
	cursor: pointer;
}
.browser-box {
	outline: 1px solid var(--button-primary-outline);
    border-radius: .25rem;        
	color: var(--button-secondary-text);
}
</style>