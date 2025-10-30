<template>
	<div class="dropzone-container">
		<div
			class="dropzone"
			:class="{ 'dropzone--active': isDragging }"
			@dragover.prevent="handleDragOver"
			@dragleave="handleDragLeave"
			@drop.prevent="handleDrop"
			@click="openFileDialog"
		>
			<!-- Only show the message when no previews exist -->
			<p
				v-if="previews.length === 0 && (currentImages == null || currentImages.length === 0)"
				class="dropzone-message text-neutral-600"
				:class="{ 'text-main font-bold': isDragging }"
			>
				<UIcon :name="ICONS.UPLOAD" class="w-6 h-6" />
				{{ multiple ? 'Drop files here or click to upload' : 'Drop a file here or click to upload' }}
				<span class="text-xs text-neutral-400" :class="{ 'text-main font-bold': isDragging }">Square images are recommended</span>
			</p>

			<!-- Previews section -->
			<div v-if="previews.length > 0" class="preview-section">
				<div class="preview-header">
					<span class="preview-count">{{ previews.length }} new image{{ previews.length > 1 ? 's' : '' }}</span>
					<UIcon v-if="previews.length > 1" :name="ICONS.TRASH" class="w-4 h-4 text-red-500 cursor-pointer" @click.stop="clearAllPreviews" />
				</div>
				<div class="preview-grid">
					<div v-for="(preview, index) in previews" :key="index" class="preview-item">
						<div class="preview-item-container group">
							<img :src="preview" alt="Preview image" />
							<UButton class="delete-button" @click.stop="removePreview(index)">
								<UIcon :name="ICONS.TRASH" class="w-4 h-4 text-red-500" />
							</UButton>
						</div>
					</div>
				</div>
			</div>

			<div v-else-if="currentImages != null && currentImages.length > 0" class="preview-section">
				<div class="preview-grid">
					<div v-for="(preview, index) in currentImages" :key="index" class="preview-item">
						<div class="preview-item-container group">
							<img v-if="preview != null" :src="preview.url" alt="Preview image" />
							<UButton class="delete-button" @click.stop="removeExistingImage(index)">
								<UIcon :name="ICONS.TRASH" class="w-4 h-4 text-red-500" />
							</UButton>
						</div>
					</div>
				</div>
			</div>
			<input ref="fileInput" type="file" class="hidden" :multiple="multiple" accept="image/*" @change="handleFileChange" />
		</div>
		<!-- Upload limit warning -->
		<div v-if="multiple && totalImageCount >= maxImages" class="upload-limit-warning">
			<UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
			<span>Maximum {{ maxImages }} images allowed</span>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	multiple: {
		type: Boolean,
		default: false,
	},
	existingImages: {
		type: Array,
		default: () => [],
	},
	maxImages: {
		type: Number,
		default: 10, // Default maximum of 10 images
	},
});

const emit = defineEmits(['files-selected']);

const fileInput = ref(null);
const isDragging = ref(false);
const previews = ref([]);
const files = ref([]);
const currentImages = ref(props.existingImages);

onMounted(() => {
	// Check if existingImages contains File objects or URL strings
	if (props.existingImages && props.existingImages.length > 0) {
		const fileObjects = [];
		const urlStrings = [];

		props.existingImages.forEach((image) => {
			if (image instanceof File) {
				// If it's a File object, add to files and create preview
				fileObjects.push(image);
			} else if (typeof image === 'string' || (image && image.url)) {
				// If it's a URL string or object with url property, add to currentImages
				urlStrings.push(image);
			}
		});

		// Set File objects to files and previews
		if (fileObjects.length > 0) {
			files.value = fileObjects;
			previewFiles(fileObjects);
		}

		// Set URL strings/objects to currentImages
		if (urlStrings.length > 0) {
			currentImages.value = urlStrings;
		} else {
			// Clear currentImages if no URLs found
			currentImages.value = [];
		}
	}
});

// Computed property to track total image count
const totalImageCount = computed(() => {
	return previews.value.length + (currentImages.value?.length || 0);
});

const handleDragOver = () => {
	isDragging.value = true;
};

const handleDragLeave = () => {
	isDragging.value = false;
};

const handleDrop = (event) => {
	isDragging.value = false;
	const droppedFiles = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith('image/'));

	if (!props.multiple && droppedFiles.length > 1) {
		// If multiple is false, only take the first file
		files.value = [droppedFiles[0]];
		previewFiles([droppedFiles[0]]);
		emit('files-selected', [droppedFiles[0]]);
	} else {
		// Limit the number of files based on current count and max limit
		const availableSlots = props.maxImages - totalImageCount.value;
		const filesToAdd = droppedFiles.slice(0, availableSlots);

		files.value = [...files.value, ...filesToAdd];
		previewFiles(files.value);
		emit('files-selected', files.value);
	}
};

const openFileDialog = () => {
	if (props.multiple && totalImageCount.value >= props.maxImages) {
		return; // Don't open dialog if limit reached
	}
	fileInput.value.click();
};

const handleFileChange = (event) => {
	const selectedFiles = Array.from(event.target.files).filter((file) => file.type.startsWith('image/'));
	if (selectedFiles.length > 0) {
		if (!props.multiple && selectedFiles.length > 1) {
			// If multiple is false, only take the first file
			files.value = [selectedFiles[0]];
			previewFiles([selectedFiles[0]]);
			emit('files-selected', [selectedFiles[0]]);
		} else {
			// Limit the number of files based on current count and max limit
			const availableSlots = props.maxImages - totalImageCount.value;
			const filesToAdd = selectedFiles.slice(0, availableSlots);

			files.value = [...files.value, ...filesToAdd];
			previewFiles(files.value);
			emit('files-selected', files.value);
		}
	}
	// Reset the input value so the same file can be selected again
	event.target.value = '';
};

const removePreview = (index) => {
	// Revoke the object URL to prevent memory leaks
	URL.revokeObjectURL(previews.value[index]);
	// Remove the preview and corresponding file
	previews.value.splice(index, 1);
	files.value.splice(index, 1);
	// Emit the updated files array
	emit('files-selected', files.value);
};

const clearAllPreviews = () => {
	// Revoke all object URLs to prevent memory leaks
	previews.value.forEach((url) => URL.revokeObjectURL(url));
	previews.value = [];
	files.value = [];
	emit('files-selected', []);
};

const removeExistingImage = (index) => {
	currentImages.value.splice(index, 1);
};

const previewFiles = (files) => {
	// Revoke previous previews
	previews.value.forEach((url) => URL.revokeObjectURL(url));
	// Set new previews
	previews.value = files.filter((file) => file.type.startsWith('image/')).map((file) => URL.createObjectURL(file));
};
</script>

<style scoped>
.dropzone-container {
	display: flex;
	flex-direction: column;
}

.dropzone {
	border-width: 2px;
	border-style: dashed;
	border-color: var(--color-neutral-300);
	border-radius: 0.75rem;
	padding: 0.25rem;
	text-align: center;
	cursor: pointer;
	transition: all 200ms;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	min-height: 120px;
	flex: 1;
}

.dropzone:hover {
	background-color: var(--color-main-50);
	border-color: var(--color-main-500);
}

.dropzone:hover p,
.dropzone:hover span {
	color: var(--color-main);
	font-weight: 700;
}

.dropzone--active {
	background-color: var(--color-main-100);
	border-color: var(--color-main-500);
	transition: all 200ms;
	color: var(--color-main);
	font-weight: 700;
}

.upload-limit-warning {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: rgb(217 119 6);
	background-color: rgb(254 252 232);
	padding: 0.75rem;
	border-radius: 0.5rem;
	border: 1px solid rgb(252 211 77);
	font-size: 0.875rem;
	line-height: 1.25rem;
	margin-top: 0.5rem;
}

.preview-section {
	width: 100%;
}

.preview-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.875rem;
	line-height: 1.25rem;
	color: var(--color-neutral-600);
}

.preview-count {
	font-weight: 500;
}

.preview-grid {
	display: flex;
	gap: 1rem;
	overflow-x: auto;
	overflow-y: hidden;
	padding: 0.5rem 0.25rem;
	scrollbar-width: thin;
	scrollbar-color: rgb(209 213 219) transparent;
}

.preview-grid::-webkit-scrollbar {
	height: 0.5rem;
}

.preview-grid::-webkit-scrollbar-track {
	background-color: transparent;
}

.preview-grid::-webkit-scrollbar-thumb {
	background-color: var(--color-neutral-300);
	border-radius: 9999px;
}

.preview-item {
	position: relative;
	min-width: 120px;
	flex-shrink: 0;
}

.preview-item-container {
	position: relative;
	width: 120px;
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.preview-item img {
	width: 120px;
	height: 120px;
	object-fit: cover;
	border-width: 2px;
	border-color: rgba(var(--color-main-500-rgb, 99, 102, 241), 0.5);
	border-radius: 0.5rem;
}

.delete-button {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	background-color: rgb(239 68 68);
	color: white;
	padding: 0.25rem;
	border-radius: 9999px;
	opacity: 0;
	transition: opacity 200ms;
	z-index: 10;
}

.group:hover .delete-button {
	opacity: 1;
}

.delete-button:hover {
	background-color: rgb(220 38 38);
}

.dropzone-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}
</style>
