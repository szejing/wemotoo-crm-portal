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

<style scoped>
.wrapper-grid {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1rem;
}

@media (min-width: 640px) {
	.wrapper-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.wrapper-stepper {
	width: 100%;
}

.side-wrapper {
	display: none;
	grid-column: span 1 / span 1;
}

@media (min-width: 640px) {
	.side-wrapper {
		display: block;
	}
}

h2 {
	color: var(--color-secondary-600);
	font-weight: 400;
}

.section-menu {
	background-color: white;
	box-shadow:
		0 4px 6px -1px rgb(0 0 0 / 0.1),
		0 2px 4px -2px rgb(0 0 0 / 0.1);
	padding: 0.5rem;
	border-radius: 9999px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--color-secondary-600);
}
</style>
