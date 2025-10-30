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

<style scoped lang="postcss">
.header-container {
	@apply px-4;
}

.merchant-info-modal :deep(h2) {
	@apply text-secondary-800 font-semibold;
}

.merchant-info-modal :deep(p) {
	@apply text-secondary-500 font-medium;
}
</style>
