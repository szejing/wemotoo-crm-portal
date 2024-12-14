<template>
	<SixDropzone id="single" v-model="photoFile" :drop-mounted="urlSingle" class="dropzone" @drop.prevent="dropSingle" @change="selectedFile">
		<template #default>
			<label for="single" class="flex-col-center gap-1 text-secondary-400">
				<UIcon :name="ICONS.UPLOAD" class="size-6" />
				<h3>Drop here</h3>
			</label>
		</template>
	</SixDropzone>
</template>

<script lang="ts" setup>
defineProps({
	urlSingle: String,
	path: String,
});

const emit = defineEmits(['update:urlSingle']);
const photoFile = ref<any>();

const dropSingle = async (e: any) => {
	try {
		const { $api } = useNuxtApp();

		const res = await $api.image.upload(e, 'new', 'category');
		// photoFile.value = res;
		emit('update:urlSingle', res.image.url);
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

const selectedFile = async (e: any) => {
	try {
		const { $api } = useNuxtApp();

		const res = await $api.image.upload(e, 'new', 'category');
		// photoFile.value = res;
		emit('update:urlSingle', res.image.url);
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

<style scoped lang="css">
.dropzone {
	@apply border-2 border-dashed border-gray-400 h-auto aspect-1 bg-transparent mt-4 rounded-md min-h-[150px];
}
</style>
