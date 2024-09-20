<template>
	<div class="header-container">
		<ZTile :thumbnail-url="merchant.profile_thumbnail" :title="merchant.name" :subtitle="merchant.merchant_id" @click-thumbnail="navigateTo('/')" />
	</div>
</template>

<script lang="ts" setup>
import { useMerchantInfoStore } from '~/stores/MerchantInfo/MerchantInfo';

const merchantInfoStore = useMerchantInfoStore();

const { merchant } = storeToRefs(merchantInfoStore);
</script>

<style scoped lang="css">
.header-container {
	@apply px-4 py-10 border-b-[1px] border-secondary-400;
}
</style>
