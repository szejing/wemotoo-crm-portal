<template>
	<div class="topbar-bg">
		<div class="sm:hidden flex justify-center items-center gap-2">
			<NuxtImg format="webp" :src="merchant.profile_thumbnail" width="40" height="40" class="rounded-[50%] cursor-pointer" preload />

			<h2 class="font-medium text-secondary-900">{{ merchant.name }}</h2>
		</div>
		<NuxtLink class="link" to="/login">
			<UIcon name="i-material-symbols-light-logout" class="text-neutral-900 w-6 h-6" />
		</NuxtLink>
	</div>
</template>

<script lang="ts" setup>
const merchantInfoStore = useMerchantInfoStore();

const { merchant } = storeToRefs(merchantInfoStore);
</script>

<style scoped lang="css">
.topbar-bg {
	@apply w-full h-14 bg-white flex justify-between sm:justify-end items-center px-4;
}

.link {
	@apply bg-secondary-50 w-10 h-10 rounded-full text-center flex justify-center items-center;
}
</style>
