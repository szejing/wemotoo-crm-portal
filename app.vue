<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtLoadingIndicator color="repeating-linear-gradient(to right,#C2C9FF 0%,#402E7A 100%)" />
			<NuxtPage />
		</NuxtLayout>
		<UNotifications />
	</div>
</template>

//
<script lang="ts" setup>
// const toast = useToast();

// onMounted(() => {
// 	const appUiStore = useAppUiStore();
// 	const { notifications } = storeToRefs(appUiStore);

// 	if (notifications.value.length > 0) {
// 		notifications.value.forEach((event: NotificationEvent) => {
// 			toast.add({
// 				id: event.id,
// 				title: event.title,
// 				description: event.description,
// 				icon: event.icon,
// 				timeout: event.timeout,
// 				// actions: event.actions,
// 			});
// 		});
// 	}
// });
//
</script>
