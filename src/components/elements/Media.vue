<script setup>
import { ref, onMounted } from 'vue';
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
		default: true
	}
});

const emit = defineEmits(["update:modelValue"]);

// Extract props from FormKit `context`
const section = ref(props.section || '');
const sectionType = ref(props.sectionType || '');
const recordId = ref(Number(props.recordId) || 0);
const edit = props.edit;

console.log('edit', props.edit);

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

// Load media type based on `section` and `sectionType`
async function loadMediaType() {
	if (!section.value || !sectionType.value) return;

	const params = `media_type=${sectionType.value}&media_section=${section.value}&base=1&attribs=files&record_id=${recordId.value}`;
	const response = await request.fetch(`entity/SystemMediaType?${params}`);

	if (response.error) {
		console.error('MediaType load error:', response.message);
		return;
	}

	mediaTypeId.value = response.data.id;
	uploadLimit.value = response.data.max_upload_size;
	allowedFormats.value = response.data.allowed_formats;
	name.value = response.data.name;

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
</script>

<template>
	<div v-if="files.length" id="gallery" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
		<div 
		v-for="(file, index) in files" 
		:key="index" 
		class="relative group max-w-[200px]"
		>
		<!-- Display Image / Video -->
		<img
			v-if="file.value.path && name === 'job_images'"
			:src="getImageUrl(file.value.path)"
			alt="Uploaded File"
			class="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer"
			@click="openViewer(index, $event)"
		/>

		<div v-if="file.value.path && name != 'job_images'">
			<div class="grid place-items-center">
				<a :href="getImageUrl(file.value.path)" download class="cursor-pointer">
				<Icon name="FileText" size="50"
						class="text-lg opacity-75 hover:opacity-100 cursor-pointer shadow"
						strokeWidth="1" stroke="red" fill="white">
				</Icon>
				</a>
			</div>
		</div>		
		<Icon v-if="file.value.path && name === 'job_images'" name="CircleX" size="24" class="pi pi-trash absolute top-2 right-2 text-lg opacity-75 hover:opacity-100 cursor-pointer shadow" strokeWidth="1" stroke="red" fill="white" @click.stop="removeFile(file, index)"></Icon>
		<Icon v-if="file.value.path && name != 'job_images'" name="CircleX" size="22" class="pi pi-trash absolute top-1 right-12 text-lg opacity-75 hover:opacity-100 cursor-pointer shadow" strokeWidth="1" stroke="red" fill="white" @click.stop="removeFile(file, index)"></Icon>

		<div class="text-center text-sm text-gray-500 mt-1">
			<p>Added by: {{ file.value.author }}</p>
		</div>
		<div class="text-center text-sm text-gray-500 mt-1">
			<p>{{ file.value.created }}</p>
		</div>
		</div>
  	</div>


	<div v-else class="text-center text-gray-500">
		<p v-if="name==='job_images'">Images or Video Attached</p> 
		<p v-else>No Files Attached</p> 
	</div>
	<div class="group max-w-[25em] min-w-0 grow mb-4 data-[disabled]:select-none data-[disabled]:opacity-50 text-base formkit-outer"
		data-type="media" data-empty="true" v-if="edit">
		<div class="formkit-wrapper">
			<label class="block text-neutral-700 text-sm font-bold mb-1 dark:text-neutral-300 formkit-label" for="input_8">{{ $attrs.label }}</label>
			<div class="formkit-inner" >
				<div class="upload-component" >
					<div class="upload-container">
						<!-- Validation Messages -->
						<p class="text-red-600 mb-1.5 text-xs" v-if="!section">Section attribute missing!</p>
						<p class="text-red-600 mb-1.5 text-xs" v-if="!sectionType">SectionType attribute missing!</p>
						<p class="text-red-600 mb-1.5 text-xs" v-if="!mediaTypeId">Invalid Media Type!</p>

						<!-- Drag & Drop Upload Box -->
						<div class="upload-box" @dragover.prevent @drop="handleDrop" v-if="section && sectionType && mediaTypeId">
							<input type="file" @change="handleFileSelect" ref="fileInput" hidden multiple />
							<div @click="triggerFileSelect">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-10 mb-1 fill-[var(--button-icon-small)] inline-block" viewBox="0 0 32 32">
									<path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" data-original="#000000"></path>
									<path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" data-original="#000000"></path>
								</svg>
								<p class="font-semibold">Drag and drop files here</p>
								<!-- <hr class="w-full border-gray-400 my-2"> -->
								<label class="browser-box block px-6 py-2.5 text-sm tracking-wider cursor-pointer font-semibold">Browse Files</label>
								<p class="text-xs italic mt-4">{{ allowedFormats }} allowed.<br />
									<span class="not-italic font-medium text-sm text-red-700">Upload limit {{ uploadLimit }}MB</span>
								</p>
							</div>
						</div>
					</div>

					<!-- Uploaded Files List -->
					<!-- <ul v-if="files.length">
						<li v-for="(file, index) in files" :key="index">
							<span class="font-medium">{{ file.value.name }}</span> ({{ formatFileSize(file.value.size)
							}})
							<progress v-if="file.value.progress < 100" :value="file.value.progress"
								max="100"></progress>
							<button @click="cancelUpload(file, index)" v-if="file.value.progress < 100">Cancel</button>
							<button @click="removeFile(file, index)" v-if="file.value.progress === 100 && edit">Delete</button>
						</li>
					</ul> -->
					<!-- Uploaded Files List -->
					<!-- Uploaded Files Grid -->
					 <!-- Image Grid -->					
				</div>
			</div>
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
