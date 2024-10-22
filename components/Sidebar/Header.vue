<template>
	<div>
		<div class="header-container cursor-pointer" @click="isMerchantInfoModal = true">
			<ZTile :thumbnail-url="merchant.profile_thumbnail" :title="merchant.name" :subtitle="merchant.merchant_id" />
		</div>

		<UModal v-model="isMerchantInfoModal">
			<UCard>
				<template #header>
					<div class="merchant-info-modal">
						<ZTile :thumbnail-url="merchant.profile_thumbnail" :title="merchant.name" :subtitle="merchant.merchant_id" />
					</div>
				</template>
			</UCard>
		</UModal>
	</div>
</template>

<script lang="ts" setup>
const merchantInfoStore = useMerchantInfoStore();

const { merchant } = storeToRefs(merchantInfoStore);
const isMerchantInfoModal = ref(false);
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
