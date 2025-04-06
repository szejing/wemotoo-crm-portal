<template>
	<div>
		<UBreadcrumb :items="links" />
		<div class="flex-jbetween-icenter">
			<h2 class="my-6">Add Product</h2>
			<div class="block sm:hidden">
				<div class="section-menu" @click="isOpen = !isOpen">
					<UIcon :name="ICONS.MENU_OPEN_ROUNDED" class="size-7 block sm:hidden" />
				</div>
			</div>
		</div>
		<div class="wrapper-grid">
			<!-- ***** Form ***** -->
			<FormProductCreation class="col-span-3" />

			<div class="side-wrapper">
				<ZInputProductSidebar />
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

					<ZInputProductSidebar />
				</UCard>
			</UModal>
		</div>
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

const isOpen = ref(false);
</script>

<style scoped lang="postcss">
.wrapper-grid {
	@apply grid grid-cols-1 sm:grid-cols-4 gap-4;
}

.side-wrapper {
	@apply hidden sm:block col-span-1;
}

h2 {
	@apply text-secondary-600 font-normal;
}

.section-menu {
	@apply bg-neutral shadow-md p-2 rounded-full text-center flex justify-center items-center text-secondary-600;
}
</style>
