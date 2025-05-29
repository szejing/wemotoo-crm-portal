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
		label: 'Order Customer Summary',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/customers',
	},
];
</script>

<style scoped lang="postcss"></style>
