<template>
	<UApp>
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
	</UApp>
</template>

<script lang="ts" setup>
import { ZModalMessage } from '#components';

const toast = useToast();

const appUiStore = useAppUiStore();
const { notification, modal } = storeToRefs(appUiStore);

watch(notification, () => {
	if (notification.value) {
		toast.add({
			id: notification.value?.id,
			color: notification.value?.color,
			title: notification.value?.title,
			description: notification.value?.description,
			icon: notification.value?.icon,
			duration: notification.value?.timeout,
			closeButton: notification.value?.closeButton,
		});
	}
});

watch(modal, () => {
	const m = useModal();
	if (modal.value) {
		m.open(ZModalMessage, {
			notification: modal.value,
			action: 'Ok',
			onConfirm: () => {
				appUiStore.clearModal();
			},
		});
	} else {
		m.close();
	}
});
</script>

<style scoped lang="postcss"></style>
