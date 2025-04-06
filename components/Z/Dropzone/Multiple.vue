<template>
	<SixDropzone id="multiple" v-model="photoFileMultiple" :drop-mounted="urlsMultiple" multiple @drop.prevent="dropMultiple" @change="selectedFileMultiple">
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
defineProps({
	urlsMultiple: Array,
	path: Array,
});
const photoFileMultiple = ref([]);

const emit = defineEmits(['update:urlsMultiple']);

// MULTIPLE
const dropMultiple = (e: any) => uploadImages(e);
const selectedFileMultiple = (e: any) => uploadImages(e);

const uploadImages = async (e: any) => {
	try {
		const { $api } = useNuxtApp();

		const res = await $api.image.uploadMultiple(e, 'new', 'category');
		emit(
			'update:urlsMultiple',
			res.images.map((image) => image.url),
		);
	} catch (err: any) {
		console.log(err);
		const appUiStore = useAppUiStore();
		appUiStore.addNotification({
			color: 'red',
			icon: ICONS.ERROR_OUTLINE,
			title: err.message,
		});
	}
};
</script>

<style scoped lang="postcss">
.dropzone {
	@apply border-2 border-dashed border-neutral-400 h-auto aspect-1 bg-transparent mt-4 rounded-md min-h-[150px];
}
</style>
