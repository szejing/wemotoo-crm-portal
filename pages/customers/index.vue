<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterCustomers />
		</div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Customers',
		icon: 'i-material-symbols-light-groups-outline-rounded',
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
