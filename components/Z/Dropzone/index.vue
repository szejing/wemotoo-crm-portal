<template>
	<div class="dropzone-container">
		<!-- Show custom preview sections when files exist -->
		<div v-if="previews.length > 0 || (currentImages != null && currentImages.length > 0)" class="custom-dropzone has-content">
			<!-- Previews section for new files -->
			<div v-if="previews.length > 0" class="preview-section">
				<div class="preview-header">
					<span class="preview-count">{{ previews.length }} new image{{ previews.length > 1 ? 's' : '' }}</span>
					<UIcon
						v-if="previews.length > 1"
						:name="ICONS.TRASH"
						class="w-4 h-4 text-red-500 cursor-pointer hover:text-red-600 transition-colors"
						@click.stop="clearAllPreviews"
					/>
				</div>
				<div class="preview-grid">
					<div v-for="(preview, index) in previews" :key="`preview-${index}`" class="preview-item">
						<div class="preview-item-container group">
							<img :src="preview" alt="Preview image" class="preview-image" />
							<button class="delete-button" type="button" @click.stop="removePreview(index)">
								<UIcon name="i-heroicons-trash" class="w-4 h-4 text-white" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Previews section for existing images -->
			<div v-else-if="currentImages != null && currentImages.length > 0" class="preview-section">
				<div class="preview-grid">
					<div v-for="(preview, index) in currentImages" :key="`existing-${index}`" class="preview-item">
						<div class="preview-item-container group">
							<img v-if="preview != null" :src="preview.url || preview" alt="Preview image" class="preview-image" />
							<button class="delete-button" type="button" @click.stop="removeExistingImage(index)">
								<UIcon name="i-heroicons-trash" class="w-4 h-4 text-white" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Use NuxtUI FileUpload when no files exist -->
		<UFileUpload
			v-else
			v-model="files"
			:multiple="multiple"
			accept="image/*"
			:disabled="multiple && totalImageCount >= maxImages"
			:icon="ICONS.UPLOAD"
			:label="multiple ? 'Drop files here or click to upload' : 'Drop a file here or click to upload'"
			description="Square images are recommended"
			class="dropzone-upload"
			:ui="{
				base: 'border-2 border-dashed border-neutral-300 rounded-xl p-4 min-h-[120px] transition-all duration-200 hover:bg-main-50 hover:border-main-500 data-[dragging=true]:bg-main-100 data-[dragging=true]:border-main-500',
				wrapper: 'flex flex-col items-center justify-center text-center gap-2',
				icon: 'w-6 h-6 text-neutral-600',
				label: 'text-neutral-600 font-normal',
				description: 'text-xs text-neutral-400',
			}"
			@update:model-value="handleFilesUpdate"
		/>

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

const previews = ref([]);
const files = ref(props.multiple ? [] : null);
const currentImages = ref([]);

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
			files.value = props.multiple ? fileObjects : fileObjects[0];
			previewFiles(fileObjects);
		}

		// Set URL strings/objects to currentImages
		if (urlStrings.length > 0) {
			currentImages.value = urlStrings;
		}
	}
});

// Watch for external changes to existingImages
watch(
	() => props.existingImages,
	(newImages) => {
		if (newImages && newImages.length > 0) {
			const urlStrings = newImages.filter((image) => typeof image === 'string' || (image && image.url));
			currentImages.value = urlStrings;
		} else {
			currentImages.value = [];
		}
	},
	{ deep: true },
);

// Computed property to track total image count
const totalImageCount = computed(() => {
	return previews.value.length + (currentImages.value?.length || 0);
});

const handleFilesUpdate = (selectedFiles) => {
	if (!selectedFiles) {
		files.value = props.multiple ? [] : null;
		previews.value = [];
		emit('files-selected', []);
		return;
	}

	// Convert to array for consistent handling
	const filesArray = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];

	// Filter only image files
	const imageFiles = filesArray.filter((file) => file.type.startsWith('image/'));

	if (!props.multiple) {
		// Single file mode - take only the first file
		if (imageFiles.length > 0) {
			files.value = imageFiles[0];
			previewFiles([imageFiles[0]]);
			emit('files-selected', [imageFiles[0]]);
		}
	} else {
		// Multiple file mode - respect max limit
		const availableSlots = props.maxImages - (currentImages.value?.length || 0);
		const filesToAdd = imageFiles.slice(0, availableSlots);

		files.value = filesToAdd;
		previewFiles(filesToAdd);
		emit('files-selected', filesToAdd);
	}
};

const removePreview = (index) => {
	// Revoke the object URL to prevent memory leaks
	if (previews.value[index]) {
		URL.revokeObjectURL(previews.value[index]);
	}

	// Remove the preview and corresponding file
	previews.value.splice(index, 1);

	if (props.multiple) {
		const updatedFiles = [...(files.value || [])];
		updatedFiles.splice(index, 1);
		files.value = updatedFiles;
		emit('files-selected', updatedFiles);
	} else {
		files.value = null;
		emit('files-selected', []);
	}
};

const clearAllPreviews = () => {
	// Revoke all object URLs to prevent memory leaks
	previews.value.forEach((url) => URL.revokeObjectURL(url));
	previews.value = [];
	files.value = props.multiple ? [] : null;
	emit('files-selected', []);
};

const removeExistingImage = (index) => {
	currentImages.value.splice(index, 1);
	// Also emit the updated files to parent
	const currentFiles = props.multiple ? files.value || [] : files.value ? [files.value] : [];
	emit('files-selected', currentFiles);
};

const previewFiles = (filesList) => {
	// Revoke previous previews
	previews.value.forEach((url) => URL.revokeObjectURL(url));

	// Set new previews
	previews.value = filesList.filter((file) => file.type.startsWith('image/')).map((file) => URL.createObjectURL(file));
};

// Cleanup on unmount
onBeforeUnmount(() => {
	previews.value.forEach((url) => URL.revokeObjectURL(url));
});
</script>

<style scoped>
.dropzone-container {
	display: flex;
	flex-direction: column;
	width: 100%;
}

/* Custom dropzone for preview state */
.custom-dropzone {
	border: 2px dashed rgb(209 213 219);
	border-radius: 0.75rem;
	padding: 0.5rem;
	min-height: 120px;
	transition: all 200ms;
}

.custom-dropzone.has-content {
	border-color: rgba(var(--color-main-500-rgb, 99, 102, 241), 0.3);
}

/* NuxtUI FileUpload styling */
.dropzone-upload {
	width: 100%;
}

/* Enhanced hover effects for text elements */
.dropzone-container :deep(.dropzone-upload:hover) p,
.dropzone-container :deep(.dropzone-upload:hover) span {
	color: var(--color-main) !important;
	font-weight: 700;
	transition: color 200ms;
}

/* Enhanced dragging state text effects */
.dropzone-container :deep(.dropzone-upload[data-dragging='true']) p,
.dropzone-container :deep(.dropzone-upload[data-dragging='true']) span {
	color: var(--color-main) !important;
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

.dropzone-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem;
}

.preview-section {
	width: 100%;
	padding: 0.5rem;
}

.preview-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.875rem;
	line-height: 1.25rem;
	color: var(--color-neutral-600);
	margin-bottom: 0.5rem;
	padding: 0 0.25rem;
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
	/* Ensure smooth scrolling on mobile */
	-webkit-overflow-scrolling: touch;
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

/* Mobile responsive sizing */
@media (max-width: 640px) {
	.preview-item {
		min-width: 100px;
	}
}

.preview-item-container {
	position: relative;
	width: 120px;
	height: 120px;
	display: block;
	border-radius: 0.5rem;
	overflow: hidden;
	cursor: pointer;
}

/* Mobile responsive sizing */
@media (max-width: 640px) {
	.preview-item-container {
		width: 100px;
		height: 100px;
	}
}

.preview-image {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-width: 2px;
	border-color: rgba(var(--color-main-500-rgb, 99, 102, 241), 0.5);
	border-radius: 0.5rem;
	transition: all 200ms ease-in-out;
}

/* Add overlay effect on hover */
.preview-item-container::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0);
	transition: background-color 200ms ease-in-out;
	z-index: 1;
	border-radius: 0.5rem;
	pointer-events: none;
}

.preview-item-container:hover::before {
	background-color: rgba(0, 0, 0, 0.4);
}

.delete-button {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgb(239 68 68);
	color: white;
	border: none;
	border-radius: 9999px;
	padding: 0.5rem;
	cursor: pointer;
	opacity: 0;
	transition: all 200ms ease-in-out;
	z-index: 20;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
}

.delete-button:hover {
	background-color: rgb(220 38 38);
	transform: translate(-50%, -50%) scale(1.1);
}

/* Show delete button on hover for desktop */
.preview-item-container:hover .delete-button {
	opacity: 1;
}

/* Always show delete button on mobile/touch devices */
@media (hover: none) and (pointer: coarse) {
	.delete-button {
		opacity: 0.95;
		top: 0.5rem;
		left: auto;
		right: 0.5rem;
		transform: none;
	}

	.delete-button:hover {
		transform: scale(1.1);
	}
}
</style>
