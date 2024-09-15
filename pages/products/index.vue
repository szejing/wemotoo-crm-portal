<template>
	<div>
		<UBreadcrumb :links="links" />
		<h1 class="font-nunito text-2xl">Products</h1>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Products',
		icon: 'i-material-symbols-light-box-add-outline-rounded',
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
