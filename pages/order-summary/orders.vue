<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterOrderSumm />
		</div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Order Summary',
		icon: ICONS.LIST,
		to: '/order-summary/orders',
	},
];
</script>

<style scoped lang="postcss"></style>
