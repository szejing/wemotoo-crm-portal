<template>
	<SixDropzone
		id="multiple"
		v-model="photoFileMultiple"
		:drop-mounted="urlsMultiple"
		multiple
		@drop.prevent="dropMultiple"
		@change="selectedFileMultiple"
		@update:model-value="modelValueFileMultiple"
	>
		<template #default>
			<label for="multiple" class="flex-col-center gap-1 text-secondary-400">
				<UIcon :name="ICONS.UPLOAD" class="size-6" />
				<span class="text-center">
					<h3>Drop here</h3>
					<p>*max 3 photos</p>
				</span>
			</label>
		</template>
	</SixDropzone>
</template>

<script lang="ts" setup>
const photoFileMultiple = ref();

defineProps({
	urlsMultiple: String,
	path: String,
});

const emit = defineEmits(['update:urlsMultiple']);

// MULTIPLE
const dropMultiple = (e: any) => {
	console.log(e.dataTransfer.files[0], 'drop');
};
const selectedFileMultiple = (e: any) => {
	console.log(e, 'change');
};
const modelValueFileMultiple = (e: any) => {
	console.log('model-value', e);

	if (e.length > 0) {
		emit(
			'update:urlsMultiple',
			e.map((file: any) => file.name),
		);
	} else if (e.length == 0) {
		emit('update:urlsMultiple', e.name);
	} else {
		emit('update:urlsMultiple', undefined);
	}
};
</script>

<style scoped lang="css">
.dropzone {
	@apply border-2 border-dashed border-gray-400 h-auto aspect-1 bg-transparent mt-4 rounded-md min-h-[150px];
}
</style>
