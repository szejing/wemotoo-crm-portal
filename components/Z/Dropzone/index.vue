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
				<div class="preview-header">
					<span class="preview-count">{{ currentImages.length }} existing image{{ currentImages.length > 1 ? 's' : '' }}</span>
				</div>
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

<style scoped lang="postcss">
.dropzone-container {
	@apply flex flex-col;
}

.dropzone {
	@apply border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex justify-center items-center flex-col min-h-[120px];
	flex: 1;
}

.dropzone:hover {
	@apply bg-main-50 border-main-500;
}

.dropzone:hover p,
.dropzone:hover span {
	@apply text-main font-bold;
}

.dropzone--active {
	@apply bg-main-100 border-main-500 transition-all duration-200 text-main font-bold;
}

.upload-limit-warning {
	@apply flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 text-sm mt-2;
}

.preview-section {
	@apply w-full;
}

.preview-header {
	@apply flex justify-between items-center text-sm text-gray-600;
}

.preview-count {
	@apply font-medium;
}

.preview-grid {
	@apply flex gap-4 overflow-x-auto overflow-y-hidden py-2 px-1;
	scrollbar-width: thin;
	scrollbar-color: theme('colors.gray.300') transparent;
}

.preview-grid::-webkit-scrollbar {
	@apply h-2;
}

.preview-grid::-webkit-scrollbar-track {
	@apply bg-transparent;
}

.preview-grid::-webkit-scrollbar-thumb {
	@apply bg-gray-300 rounded-full;
}

.preview-item {
	@apply relative min-w-[120px] flex-shrink-0;
}

.preview-item-container {
	@apply relative w-[120px] h-[120px] flex items-center justify-center;
}

.preview-item img {
	@apply w-[120px] h-[120px] object-cover border-2 border-main-500/50 rounded-lg;
}

.delete-button {
	@apply absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10;
}

.dropzone-message {
	@apply flex flex-col items-center gap-2;
}
</style>
