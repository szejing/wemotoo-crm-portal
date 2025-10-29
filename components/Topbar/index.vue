<template>
	<div class="topbar-bg">
		<div class="merchant-info" @click="toggleSidebarModal">
			<ZTile :thumbnail-url="thumbnail" :title="merchantName" :subtitle="merchantId" />
		</div>

		<div class="logout-btn" @click="logout">
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
/* Custom component styles */
.topbar-bg {
	width: 100%;
	height: 5rem; /* h-20 */
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 1rem;
	background: linear-gradient(to bottom, var(--color-secondary-600), var(--color-main-600));
}

@media (min-width: 768px) {
	.topbar-bg {
		height: 4rem; /* md:h-16 */
		justify-content: flex-end;
		background: white;
	}
}

.merchant-info {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
}

@media (min-width: 768px) {
	.merchant-info {
		display: none;
	}
}

.logout-btn {
	background-color: var(--color-secondary-50);
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 9999px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--color-neutral-900);
	cursor: pointer;
	transition: all 0.2s;
}

.logout-btn:hover {
	background-color: var(--color-secondary-100);
}

/* Styles for child component (ZTile) */
:deep(h2) {
	@apply font-semibold text-secondary-900;
}

:deep(p) {
	@apply font-normal text-xs text-secondary-700;
}
</style>
