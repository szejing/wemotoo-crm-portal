<template>
	<UUser
		:name="collapsed ? undefined : merchantId"
		:description="collapsed ? undefined : merchantName"
		:avatar="{
			src: thumbnail,
			alt: merchantName,
		}"
	/>
</template>

<script lang="ts" setup>
import { GROUP_CODE, MERCHANT } from 'wemotoo-common';

const merchantInfoStore = useMerchantInfoStore();

defineProps<{
	collapsed?: boolean;
}>();

const merchantName = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.NAME)?.getString() ?? '';
});

const merchantId = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.ID)?.getString() ?? '';
});

const thumbnail = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.THUMBNAIL)?.getString() ?? '';
});
</script>

<style scoped>
.header-container {
	padding-left: 1rem;
	padding-right: 1rem;
}
</style>
