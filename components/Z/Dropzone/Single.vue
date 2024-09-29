<template>
	<SixDropzone
		id="single"
		v-model="photoFile"
		:drop-mounted="urlSingle"
		class="dropzone"
		@drop.prevent="dropSingle"
		@change="selectedFile"
		@update:model-value="modelValueFile"
	>
		<template #default>
			<label for="single" class="flex-col-center gap-1 text-secondary-400">
				<UIcon name="i-material-symbols-upload-rounded" class="size-6" />
				<h3>Drop here</h3>
			</label>
		</template>
	</SixDropzone>
</template>

<script lang="ts" setup>
defineProps({
	urlSingle: String,
});

const emit = defineEmits(['update:urlSingle']);
const photoFile = ref();

const dropSingle = (e: any) => {
	console.log(e.dataTransfer.files[0], 'drop');
};
const selectedFile = (e: any) => {
	console.log(e, 'selected-file');
};
const modelValueFile = (e: any) => {
	console.log('e.name', e.name);
	emit('update:urlSingle', e.name);
};
</script>

<style scoped lang="css">
.dropzone {
	@apply border-2 border-dashed border-gray-400 h-auto aspect-1 bg-transparent mt-4 rounded-md min-h-[150px];
}
</style>
