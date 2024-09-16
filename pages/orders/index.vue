<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterOrders />
		</div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Orders',
		icon: 'i-material-symbols-light-order-approve-outline-rounded',
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
