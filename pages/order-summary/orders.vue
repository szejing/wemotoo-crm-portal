<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base"></div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Order Summary',
		icon: ICONS.LIST,
		to: '/summary/orders',
	},
];
</script>

<style scoped lang="postcss"></style>
