<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base"></div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Sales Summary',
		icon: ICONS.LIST,
		to: '/sales-summary/sales',
	},
];
</script>

<style scoped lang="postcss"></style>
