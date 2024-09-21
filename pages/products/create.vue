<template>
	<div>
		<UBreadcrumb :links="links" />
		<h2 class="my-6">Add Product</h2>
		<div class="grid grid-cols-4 gap-4">
			<FormProductCreation class="col-span-3" />
			<div class="col-span-1 space-y-4">
				<!-- ***** Status ***** -->
				<UCard :ui="cardBg">
					<template #header>
						<h3>Status</h3>
						<ZSelectMenuProductStatus />
					</template>
				</UCard>

				<!-- ***** Categories ***** -->
				<UCard :ui="cardBg">
					<template #header>
						<h3>Categories</h3>
						<ZSelectMenuCategories />
					</template>
				</UCard>

				<!-- ***** Tags ***** -->
				<UCard :ui="cardBg">
					<template #header>
						<h3>Tags</h3>
						<ZSelectMenuTags />
					</template>
				</UCard>

				<!-- ***** Image Thumbnails ***** -->
				<UCard :ui="cardBg">
					<template #header>
						<h3>Image</h3>
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
								<label for="single" class="flex flex-col justify-center items-center gap-1 text-secondary-400">
									<UIcon name="i-material-symbols-upload-rounded" class="w-6 h-6" />
									<h3 class="text-secondary-400">Drop here</h3>
								</label>
							</template>
						</SixDropzone>
					</template>
				</UCard>
				<!-- ***** Galleries ***** -->
				<UCard :ui="cardBg">
					<template #header>
						<h3>Galleries</h3>
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
								<label for="multiple" class="flex flex-col justify-center items-center gap-1 text-secondary-400">
									<UIcon name="i-material-symbols-upload-rounded" class="w-6 h-6" />
									<span class="text-center">
										<h3 class="text-secondary-400">Drop here</h3>
										<p class="text-secondary-400 text-sm font-nunito font-normal">*max 3 photos</p>
									</span>
								</label>
							</template>
						</SixDropzone>
					</template>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Products',
		icon: 'i-material-symbols-light-box-add-outline-rounded',
		to: '/products',
	},
	{
		label: 'New Product',
		to: '/create',
	},
];

const cardBg = { background: 'bg-secondary-100', shadow: 'shadow-sm' };

const photoFile = ref();
const urlSingle = ref();
// const url = ref('https://i.imgur.com/PcRn7hB.jpeg');

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
const dropSingle = (e: any) => {
	console.log(e.dataTransfer.files[0], 'drop');
};
const selectedFile = (e: any) => {
	console.log(e, 'change');
};
const modelValueFile = (e: any) => {
	console.log(e, 'model-value');
};

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
h2 {
	@apply text-secondary-600 font-normal;
}

.dropzone {
	@apply border-2 border-dashed border-gray-400 h-auto aspect-1 bg-transparent mt-4 rounded-md min-h-[150px];
}
</style>
