<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[30%]',
		}"
	>
		<UCard>
			<div class="space-y-2">
				<h3>{{ title }}</h3>
				<p>{{ message }}</p>
			</div>

			<template #footer>
				<div v-if="action == 'delete'" class="flex-jend gap-4">
					<UButton color="neutral" variant="ghost" @click="onCancel">Cancel</UButton>
					<UButton color="red" variant="soft" @click="onConfirm">Confirm</UButton>
				</div>

				<div v-else class="flex-jend gap-4">
					<UButton @click="onCancel">Cancel</UButton>
					<UButton @click="onConfirm">Confirm</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<script lang="ts" setup>
defineProps({
	title: {
		type: String,
		default: 'Confirmation',
	},
	message: {
		type: String,
		default: 'Are you sure you want to proceed?',
	},
	action: {
		type: String,
		default: 'confirm',
	},
});

const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => {
	emit('confirm');
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style></style>
