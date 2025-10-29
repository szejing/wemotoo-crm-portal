<template>
	<UModal
		:ui="{
			content: 'w-full sm:w-[50%] md:w-[30%]',
		}"
	>
		<UCard :ui="{ root: `border-t-4 ${notification?.color == 'error' ? 'border-t-red-600' : 'border-t-primary-500'}` }">
			<div class="space-y-2">
				<h3 class="text-lg text-center" :class="notification?.color == 'error' ? 'text-red-600' : 'text-primary-500'">{{ notification?.title }}</h3>
				<p class="text-neutral-800">{{ notification?.description }}</p>
			</div>

			<template #footer>
				<div class="mx-auto w-[50%] sm:w-[25%]">
					<UButton variant="soft" block color="neutral" @click="onConfirm">{{ action }}</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<script lang="ts" setup>
import type { ToastNotification } from '~/utils/types/event-notification';

defineProps({
	notification: {
		type: Object as PropType<ToastNotification>,
		default: undefined,
	},
	action: {
		type: String,
		default: 'Ok',
	},
});

const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => {
	emit('confirm');
};
</script>

<style scoped lang="postcss"></style>
