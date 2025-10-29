<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="flex-jbetween-icenter">
			<h2 class="my-6">Add Product</h2>
			<!-- <div class="flex items-center gap-4">
				<div class="block sm:hidden">
					<div class="section-menu" @click="isOpen = !isOpen">
						<UIcon :name="ICONS.MENU_OPEN_ROUNDED" class="size-7 block sm:hidden" />
					</div>
				</div>
			</div> -->
		</div>

		<!-- Stepper Mode -->
		<div class="wrapper-stepper">
			<FormProductStepperCreation />
		</div>

		<!-- Original Form Mode -->
		<!-- ***** Form ***** -->
		<!-- <div v-else class="wrapper-grid">
			<FormProductCreation class="col-span-3" />

			<div class="side-wrapper">
				<ZInputProductSidebar
					:product="newProduct"
					@update:status="updateStatus"
					@update:brands="updateBrands"
					@update:categories="updateCategories"
					@update:tags="updateTags"
					@update:thumbnail="updateThumbnail"
					@update:images="updateImages"
				/>
			</div>

			<UModal v-model:open="isOpen">
				<UCard
					:ui="{
						body: {
							base: 'container mx-auto',
							background: '',
							padding: 'px-4 py-5 sm:p-6',
						},
					}"
				>
					<template #header>
						<div class="flex-jbetween-icenter">
							<h2>Product Status & Thumbnails</h2>
							<UIcon :name="ICONS.CLOSE_ROUNDED" class="size-7 text-secondary-600" @click="isOpen = false" />
						</div>
					</template>

					<ZInputProductSidebar
						:product="newProduct"
						@update:status="updateStatus"
						@update:brands="updateBrands"
						@update:categories="updateCategories"
						@update:tags="updateTags"
						@update:thumbnail="updateThumbnail"
						@update:images="updateImages"
					/>
				</UCard>
			</UModal>
		</div> -->
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
	},
	{
		label: 'New Product',
		to: '/create',
	},
];

// const isOpen = ref(false);

const productStore = useProductStore();
// const { newProduct } = storeToRefs(productStore);

useHead({ title: 'Wemotoo CRM - Create Product' });

onBeforeRouteLeave(() => {
	productStore.resetNewProduct();
});

// const updateStatus = (value: ProductStatus) => {
// 	newProduct.value.status = value;
// };

// const updateBrands = (value: Brand[]) => {
// 	newProduct.value.brands = value;
// };

// const updateCategories = (value: Category[]) => {
// 	newProduct.value.categories = value;
// };

// const updateTags = (value: Tag[]) => {
// 	newProduct.value.tags = value;
// };

// const updateThumbnail = (value: File) => {
// 	newProduct.value.thumbnail = value;
// };

// const updateImages = (value: File[]) => {
// 	newProduct.value.images = value;
// };
</script>

<style scoped lang="postcss">
.wrapper-grid {
	@apply grid grid-cols-1 sm:grid-cols-4 gap-4;
}

.wrapper-stepper {
	@apply w-full;
}

.side-wrapper {
	@apply hidden sm:block col-span-1;
}

h2 {
	@apply text-secondary-600 font-normal;
}

.section-menu {
	@apply bg-white shadow-md p-2 rounded-full text-center flex justify-center items-center text-secondary-600;
}
</style>
