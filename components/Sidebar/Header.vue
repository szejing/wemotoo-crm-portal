<template>
	<div>
		<div class="header-container cursor-pointer pb-8" @click="isMerchantInfoModal = true">
			<ZTile :thumbnail-url="thumbnail" :title="merchantName" :subtitle="merchantId" />
		</div>

		<UModal v-model="isMerchantInfoModal">
			<UCard>
				<template #header>
					<div class="merchant-info-modal">
						<ZTile :thumbnail-url="thumbnail" :title="merchantName" :subtitle="merchantId" />
					</div>
				</template>
			</UCard>
		</UModal>
	</div>
</template>

<script lang="ts" setup>
import { GROUP_CODE, MERCHANT_SETTING_CODE } from 'wemotoo-common';

const merchantInfoStore = useMerchantInfoStore();

const isMerchantInfoModal = ref(false);

const merchantName = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT_SETTING_CODE.NAME)?.getString() ?? '';
});

const merchantId = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT_SETTING_CODE.ID)?.getString() ?? '';
});

const thumbnail = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT_SETTING_CODE.THUMBNAIL)?.getString() ?? '';
});
</script>

<style scoped lang="postcss">
.header-container {
	@apply px-4 border-b-[1px] border-secondary-400;
}

.merchant-info-modal :deep(h2) {
	@apply text-secondary-800 font-semibold;
}

.merchant-info-modal :deep(p) {
	@apply text-secondary-500 font-medium;
}
</style>
