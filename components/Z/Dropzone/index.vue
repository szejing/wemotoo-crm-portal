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
			<p class="dropzone-message text-neutral-600" :class="{ 'text-main font-bold': isDragging }">
				<UIcon :name="ICONS.UPLOAD" class="w-6 h-6" />
				{{ multiple ? 'Drop files here or click to upload' : 'Drop a file here or click to upload' }}
				<span class="text-xs text-neutral-400" :class="{ 'text-main font-bold': isDragging }">Square images are recommended</span>
			</p>

			<input ref="fileInput" type="file" class="hidden" :multiple="multiple" accept="image/*" @change="handleFileChange" />
		</div>

		<!-- Previews section -->
		<div v-if="previews.length > 0" class="preview-section">
			<div class="preview-grid">
				<div v-for="(preview, index) in previews" :key="index" class="preview-item">
					<div class="preview-item-container group">
						<img :src="preview" alt="Preview image" />
						<UButton class="delete-button" @click="removePreview(index)">
							<UIcon name="i-heroicons-trash" class="w-5 h-5" />
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
						<UButton class="delete-button" @click="removeExistingImage(index)">
							<UIcon name="i-heroicons-trash" class="w-5 h-5" />
						</UButton>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	multiple: {
		type: Boolean,
		default: false,
	},
	existingImages: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(['files-selected']);

const fileInput = ref(null);
const isDragging = ref(false);
const previews = ref([]);
const files = ref([]);
const currentImages = ref(props.existingImages);

const handleDragOver = () => {
	isDragging.value = true;
};

const handleDragLeave = () => {
	isDragging.value = false;
};

const handleDrop = (event) => {
	isDragging.value = false;
	const droppedFiles = Array.from(event.dataTransfer.files);
	if (!props.multiple && droppedFiles.length > 1) {
		// If multiple is false, only take the first file
		files.value = [droppedFiles[0]];
		previewFiles([droppedFiles[0]]);
		emit('files-selected', [droppedFiles[0]]);
	} else {
		files.value = droppedFiles;
		previewFiles(droppedFiles);
		emit('files-selected', droppedFiles);
	}
};

const openFileDialog = () => {
	fileInput.value.click();
};

const handleFileChange = (event) => {
	const selectedFiles = Array.from(event.target.files);
	if (selectedFiles.length > 0) {
		if (!props.multiple && selectedFiles.length > 1) {
			// If multiple is false, only take the first file
			files.value = [selectedFiles[0]];
			previewFiles([selectedFiles[0]]);
			emit('files-selected', [selectedFiles[0]]);
		} else {
			files.value = selectedFiles;
			previewFiles(selectedFiles);
			emit('files-selected', selectedFiles);
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
	@apply flex flex-col mx-auto;
}

.dropzone {
	@apply border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex justify-center items-center flex-col;
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

.preview-section {
	@apply flex-1 min-w-0;
}

.preview-grid {
	@apply flex gap-4 overflow-x-auto w-full snap-x snap-mandatory mt-2 py-2;
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
	@apply flex-none snap-center;
}

.preview-item-container {
	@apply relative;
}

.delete-button {
	@apply absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600;
}

.preview-item img {
	@apply max-w-[150px] max-h-[150px] border-2 border-main-500/50 rounded-lg;
}

.dropzone-message {
	@apply flex flex-col items-center;
}
</style>
