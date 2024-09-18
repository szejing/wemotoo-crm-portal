<template>
	<div>
		<UBreadcrumb :links="links" />
		<h2 class="my-6">Add Product</h2>
		<div class="grid grid-cols-4 gap-4">
			<FormProductCreation class="col-span-3" />
			<div class="col-span-1 space-y-4">
				<!-- ***** Categories ***** -->
				<UCard :ui="cardBg">
					<template #header>
						<h2>Categories</h2>
					</template>
				</UCard>

				<!-- ***** Tags ***** -->
				<UCard :ui="cardBg">
					<template #header>
						<h2>Tags</h2>
					</template>
				</UCard>

				<!-- ***** Image Thumbnails ***** -->
				<UCard :ui="cardBg">
					<template #header>
						<h2>Image</h2>
					</template>
				</UCard>
				<!-- ***** Galleries ***** -->
				<UCard :ui="cardBg">
					<template #header>
						<h2>Galleries</h2>
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
</script>

<style scoped lang="css">
h2 {
	@apply text-secondary-600 font-normal;
}
</style>
