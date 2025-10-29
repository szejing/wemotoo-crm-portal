<template>
	<UApp>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtLoadingIndicator color="repeating-linear-gradient(to right,#C2C9FF 0%,#402E7A 100%)" />
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>

<script lang="ts" setup>
import { ZModalMessage } from '#components';

const toast = useToast();

const appUiStore = useAppUiStore();
const { toastNotification, modal } = storeToRefs(appUiStore);

watch(toastNotification, () => {
	if (toastNotification.value) {
		toast.add({
			id: toastNotification.value.id,
			color: toastNotification.value.color,
			title: toastNotification.value.title,
			description: toastNotification.value.description,
			icon: toastNotification.value.icon,
			duration: toastNotification.value.timeout,
			progress: false,
			closeIcon: ICONS.CLOSE_ROUNDED,
		});
	}
});

watch(modal, () => {
	const m = useOverlay();
	if (modal.value) {
		m.create(ZModalMessage, {
			props: {
				notification: modal.value,
				action: 'Ok',
				onConfirm: () => {
					appUiStore.clearModal();
				},
			},
		});
	}
});
</script>

<style scoped lang="postcss"></style>
