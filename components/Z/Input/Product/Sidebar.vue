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
				<h3>Main Category</h3>
				<ZSelectMenuCategory v-model:category="newProduct.category" />

				<h3>Sub Categories</h3>
				<ZSelectMenuCategories v-model:categories="newProduct.subCategories" />
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
			<ZDropzoneSingle :url-single="newProduct.thumbnail" @update:url-single="updateThumbnail" />
		</UCard>
		<!-- ***** Galleries ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Galleries</h3>
			</template>
			<ZDropzoneMultiple :urls-multiple="newProduct.galleries" @update:urls-multiple="updateGalleries" />
		</UCard>
	</div>
</template>

<script lang="ts" setup>
const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-md' };

const productStore = useProductStore();
const { newProduct } = storeToRefs(productStore);

const updateThumbnail = (url: string) => {
	newProduct.value.thumbnail = url;
};

const updateGalleries = (urls: string[]) => {
	console.log(urls);
	// newProduct.value.thumbnail = url;
};
</script>

<style scoped lang="postcss"></style>
