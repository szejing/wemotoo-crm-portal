<script lang="ts" setup>
const route = useRoute();
const type = Array.isArray(route.query.type) ? route.query.type[0] : route.query.type;
if (typeof type === 'string' && type.toLowerCase() === 'product') {
	await navigateTo('/marketing/vouchers/product/create', { replace: true });
} else {
	await navigateTo('/marketing/vouchers/shop/create', { replace: true });
}
</script>

<template>
	<div />
</template>
