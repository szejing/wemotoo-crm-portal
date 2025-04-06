<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base"></div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Order Item Summary',
		icon: ICONS.LIST,
		to: '/summary/order-items',
	},
];
</script>

<style scoped lang="postcss"></style>
