<template>
	<div>
		<UBreadcrumb :links="links" />
		<h1>Store</h1>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Overview',
		icon: 'i-material-symbols-light-dashboard-outline-rounded',
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
