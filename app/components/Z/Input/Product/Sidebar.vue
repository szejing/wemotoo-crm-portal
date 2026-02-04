<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>{{ $t('components.zInput.productSidebarStatus') }}</h3>
				<ZSelectMenuProductStatus v-model:status="status" class="mt-2" />
			</template>
		</UCard>

		<!-- ***** Brands ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>{{ $t('components.zInput.productSidebarBrands') }}</h3>
				<ZSelectMenuBrands v-model:brands="brands" />
			</template>
		</UCard>

		<!-- ***** Categories ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>{{ $t('components.zInput.productSidebarCategory') }}</h3>
				<ZSelectMenuCategories v-model:categories="categories" />
			</template>
		</UCard>

		<!-- ***** Tags ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>{{ $t('components.zInput.productSidebarTags') }}</h3>
				<ZSelectMenuTags v-model:tags="tags" />
			</template>
		</UCard>

		<!-- ***** Image Thumbnails ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>{{ $t('components.zInput.productSidebarThumbnail') }}</h3>
			</template>

			<ZDropzone :existing-images="[product.thumbnail]" @files-selected="updateThumbnail" />
		</UCard>
		<!-- ***** Images ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>{{ $t('components.zInput.productSidebarImages') }}</h3>
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

const emit = defineEmits(['update:status', 'update:brands', 'update:categories', 'update:tags', 'update:thumbnail', 'update:images']);

const status = computed({
	get() {
		return props.product.status;
	},
	set(value) {
		emit('update:status', value);
	},
});

const brands = computed({
	get() {
		return props.product.brands;
	},
	set(value) {
		emit('update:brands', value);
	},
});

const categories = computed({
	get() {
		return props.product.categories;
	},
	set(value) {
		emit('update:categories', value);
	},
});

const tags = computed({
	get() {
		return props.product.tags;
	},
	set(value) {
		emit('update:tags', value);
	},
});

const updateThumbnail = (files: File[]) => {
	// newProduct.value.thumbnail = files[0];
	emit('update:thumbnail', files[0]);
};

const updateImages = (files: File[]) => {
	// newProduct.value.images = files;
	emit('update:images', files);
};
</script>

<style scoped></style>
