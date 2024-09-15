<template>
	<div>
		<UBreadcrumb :links="links" />
		<h1 class="font-nunito text-2xl">Customers</h1>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Customers',
		icon: 'i-material-symbols-light-groups-outline-rounded',
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
