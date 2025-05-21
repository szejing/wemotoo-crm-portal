<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Status</h3>
				<ZSelectMenuProductStatus v-model:status="newProduct.status" class="mt-2" />
			</template>
		</UCard>

		<!-- ***** Categories ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Category</h3>
				<ZSelectMenuCategories v-model:categories="newProduct.categories" />
			</template>
		</UCard>

		<!-- ***** Tags ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Tags</h3>
				<ZSelectMenuTags v-model:tags="newProduct.tags" />
			</template>
		</UCard>

		<!-- ***** Image Thumbnails ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Image</h3>
			</template>

			<ZDropzone type="product" @files-selected="updateThumbnail" />
		</UCard>
		<!-- ***** Images ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Images</h3>
			</template>

			<ZDropzone type="product" multiple @files-selected="updateImages" />
		</UCard>
	</div>
</template>

<script lang="ts" setup>
const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-md' };

const productStore = useProductStore();
const { newProduct } = storeToRefs(productStore);

const updateThumbnail = (files: File[]) => {
	newProduct.value.thumbnail = files[0];
};

const updateImages = (files: File[]) => {
	newProduct.value.images = files;
};
</script>

<style scoped lang="postcss"></style>
