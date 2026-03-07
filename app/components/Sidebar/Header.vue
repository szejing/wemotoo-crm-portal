<template>
	<div class="cursor-pointer" @click="navigateTo('/settings/store-profile')">
		<ClientOnly>
			<UUser
				:name="collapsed ? undefined : merchantId"
				:description="collapsed ? undefined : merchantName"
				:avatar="avatarProps"
			/>
			<template #fallback>
				<div class="inline-flex items-center gap-3">
					<USkeleton class="size-8 shrink-0 rounded-full" />
					<div v-if="!collapsed" class="flex flex-1 flex-col gap-1">
						<USkeleton class="h-4 w-24" />
						<USkeleton class="h-3 w-16" />
					</div>
				</div>
			</template>
		</ClientOnly>
	</div>
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

const avatarProps = computed(() =>
	thumbnail.value
		? {
				src: thumbnail.value,
				alt: merchantName.value,
				ui: { image: 'rounded-md' },
			}
		: undefined,
);
</script>

<style scoped>
.header-container {
	padding-left: 1rem;
	padding-right: 1rem;
}
</style>
