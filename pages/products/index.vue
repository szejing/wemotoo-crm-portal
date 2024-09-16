<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterProducts />
		</div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Products',
		icon: 'i-material-symbols-light-box-add-outline-rounded',
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
