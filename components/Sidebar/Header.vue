<template>
	<div>
		<UModal v-model:open="open">
			<div class="cursor-pointer px-4" @click="open = true">
				<ZTile :thumbnail-url="thumbnail" :title="merchantName" :subtitle="merchantId" />
			</div>
			<template #header>
				<div class="merchant-info-modal">
					<ZTile :thumbnail-url="thumbnail" :title="merchantName" :subtitle="merchantId" />
				</div>
			</template>
		</UModal>
	</div>
</template>

<script lang="ts" setup>
import { GROUP_CODE, MERCHANT } from 'wemotoo-common';

const merchantInfoStore = useMerchantInfoStore();

const open = ref(false);

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

.merchant-info-modal :deep(h2) {
	color: var(--color-secondary-800);
	font-weight: 600;
}

.merchant-info-modal :deep(p) {
	color: var(--color-secondary-500);
	font-weight: 500;
}
</style>
