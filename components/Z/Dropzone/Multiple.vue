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
				<UIcon name="i-material-symbols-upload-rounded" class="size-6" />
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
const urlsMultiple = ref();
// const urlsMultiple = ref([
// 	{
// 		path: 'https://i.imgur.com/PcRn7hB.jpeg',
// 	},
// 	{
// 		path: 'https://i.imgur.com/HkulqHb.jpeg',
// 	},
// 	{
// 		path: 'https://i.imgur.com/cJNCe4F.jpeg',
// 	},
// 	{
// 		path: 'https://i.imgur.com/osJyAlk.jpeg',
// 	},
// 	{
// 		path: 'https://i.imgur.com/AVU0Q0z.jpeg',
// 	},
// ]);

// MULTIPLE
const dropMultiple = (e: any) => {
	console.log(e.dataTransfer.files[0], 'drop');
};
const selectedFileMultiple = (e: any) => {
	console.log(e, 'change');
};
const modelValueFileMultiple = (e: any) => {
	console.log(e, 'model-value');
};
</script>

<style scoped lang="css">
.dropzone {
	@apply border-2 border-dashed border-gray-400 h-auto aspect-1 bg-transparent mt-4 rounded-md min-h-[150px];
}
</style>
