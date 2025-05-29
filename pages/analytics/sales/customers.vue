<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base"></div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Customer Reports',
		icon: ICONS.LIST,
		to: '/summary/sales/customers',
	},
];
</script>

<style scoped lang="postcss"></style>
