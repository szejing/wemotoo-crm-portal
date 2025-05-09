<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base"></div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Order Customer Summary',
		icon: ICONS.LIST,
		to: '/summary/orders/customers',
	},
];
</script>

<style scoped lang="postcss"></style>
