<template>
	<div>
		<UBreadcrumb :links="links" />
		<h1>Settings</h1>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Settings',
		icon: ICONS.SETTINGS_ROUNDED,
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
