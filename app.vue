<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtLoadingIndicator color="repeating-linear-gradient(to right,#C2C9FF 0%,#402E7A 100%)" />
			<NuxtPage />
		</NuxtLayout>
		<UNotifications
			:close-button="{
				icon: ICONS.CLOSE_ROUNDED,
				variant: 'link',
				color: 'white',
				padded: true,
			}"
		/>
		<UModals />
	</div>
</template>

//
<script lang="ts" setup>
const toast = useToast();

const appUiStore = useAppUiStore();
const { notification } = storeToRefs(appUiStore);

watch(notification, () => {
	if (notification.value) {
		toast.add({
			id: notification.value?.id,
			color: notification.value?.color,
			title: notification.value?.title,
			description: notification.value?.description,
			icon: notification.value?.icon,
			timeout: notification.value?.timeout,
			closeButton: notification.value?.closeButton,
		});
	}
});
</script>
