<template>
	<div>
		<UBreadcrumb :links="links" />
		<h1 class="font-nunito text-2xl">Orders</h1>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Orders',
		icon: 'i-material-symbols-light-order-approve-outline-rounded',
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
