<template>
	<div class="topbar-bg">
		<div class="md:hidden flex justify-center items-center gap-2" @click="toggleSidebarModal">
			<!-- <NuxtImg format="webp" :src="merchant.profile_thumbnail" width="40" height="40" class="rounded-[50%] cursor-pointer" preload />

			<div class="flex-col-start leading-tight">
				<h2 class="font-semibold text-secondary-900">{{ merchant.name }}</h2>
				<p class="font-normal text-xs text-secondary-700">{{ merchant.merchant_id }}</p>
			</div> -->

			<ZTile :thumbnail-url="thumbnail" :title="merchantName" :subtitle="merchantId" />
		</div>

		<div class="link" @click="logout">
			<UIcon :name="ICONS.LOGOUT" class="size-6" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { GROUP_CODE, MERCHANT } from 'wemotoo-common';

const merchantInfoStore = useMerchantInfoStore();
const appUiStore = useAppUiStore();

const { toggleSidebarModal } = appUiStore;

const merchantName = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.NAME)?.getString() ?? '';
});

const merchantId = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.ID)?.getString() ?? '';
});

const thumbnail = computed(() => {
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.THUMBNAIL)?.getString() ?? '';
});

const logout = async () => {
	const authStore = useAuthStore();
	await authStore.logout();

	navigateTo('/login');
};
</script>

<style scoped lang="postcss">
.topbar-bg {
	@apply w-full h-20 md:h-16 bg-white flex justify-between md:justify-end items-center px-4;
}

.link {
	@apply bg-secondary-50 w-10 h-10 rounded-full text-center flex justify-center items-center text-neutral-900;
}

:deep(h2) {
	@apply font-semibold text-secondary-900;
}

:deep(p) {
	@apply font-normal text-xs text-secondary-700;
}
</style>
