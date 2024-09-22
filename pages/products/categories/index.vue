<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterProducts />
			<UCard class="mt-4"></UCard>
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
		label: 'All Categories',
		icon: 'i-material-symbols-light-lists-rounded',
		to: '/products/categories',
	},
];
</script>

<style scoped lang="css"></style>
