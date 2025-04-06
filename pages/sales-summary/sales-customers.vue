<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base"></div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Sales Customer Summary',
		icon: ICONS.LIST,
		to: '/sales-summary/sales-customers',
	},
];
</script>

<style scoped lang="postcss"></style>
