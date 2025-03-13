<template>
	<div>
		<UBreadcrumb :items="links" />
		<h1>Merchant Info</h1>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Overview',
		icon: ICONS.DASHBOARD_ROUNDED,
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
