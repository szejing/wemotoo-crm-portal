<template>
	<div>
		<div class="header-container cursor-pointer pb-8" @click="isMerchantInfoModal = true">
			<ZTile :thumbnail-url="thumbnail" :title="merchantName" :subtitle="merchantId" />
		</div>

		<UModal v-model:open="isMerchantInfoModal">
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
import { GROUP_CODE } from '~/utils/constants/group-code';
import { SETTING_CODE } from '~/utils/constants/setting-code';

const merchantInfoStore = useMerchantInfoStore();

const isMerchantInfoModal = ref(false);

const merchantName = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, SETTING_CODE.MERCHANT_NAME)?.set_value ?? '';
});

const merchantId = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, SETTING_CODE.MERCHANT_ID)?.set_value ?? '';
});

const thumbnail = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, SETTING_CODE.MERCHANT_THUMBNAIL)?.set_value ?? '';
});
</script>

<style scoped lang="css">
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
