<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base"></div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Customer Reports',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/customers',
	},
];
</script>

<style scoped lang="postcss"></style>
