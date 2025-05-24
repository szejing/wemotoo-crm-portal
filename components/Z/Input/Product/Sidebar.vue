<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Status</h3>
				<ZSelectMenuProductStatus v-model:status="status" class="mt-2" />
			</template>
		</UCard>

		<!-- ***** Categories ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Category</h3>
				<ZSelectMenuCategories v-model:categories="categories" />
			</template>
		</UCard>

		<!-- ***** Tags ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Tags</h3>
				<ZSelectMenuTags v-model:tags="tags" />
			</template>
		</UCard>

		<!-- ***** Image Thumbnails ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Thumbnail</h3>
			</template>

			<ZDropzone :existing-images="[product.thumbnail]" @files-selected="updateThumbnail" />
		</UCard>
		<!-- ***** Images ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Images</h3>
			</template>

			<ZDropzone multiple :existing-images="product.images" @files-selected="updateImages" />
		</UCard>
	</div>
</template>

<script lang="ts" setup>
import type { Product } from '~/utils/types/product';

const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-md' };

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true,
	},
});

const emit = defineEmits(['update_status', 'update_categories', 'update_tags', 'update_thumbnail', 'update_images']);

const status = computed({
	get() {
		return props.product.status;
	},
	set(value) {
		emit('update_status', value);
	},
});

const categories = computed({
	get() {
		return props.product.categories;
	},
	set(value) {
		emit('update_categories', value);
	},
});

const tags = computed({
	get() {
		return props.product.tags;
	},
	set(value) {
		emit('update_tags', value);
	},
});

const updateThumbnail = (files: File[]) => {
	// newProduct.value.thumbnail = files[0];
	emit('update_thumbnail', files[0]);
};

const updateImages = (files: File[]) => {
	// newProduct.value.images = files;
	emit('update_images', files);
};
</script>

<style scoped lang="postcss"></style>
