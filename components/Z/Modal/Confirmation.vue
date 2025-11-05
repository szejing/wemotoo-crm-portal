<template>
	<UModal
		:ui="{
			content: 'w-full sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%]',
		}"
	>
		<template #body>
			<div class="space-y-2">
				<h3>{{ title }}</h3>
				<p>{{ message }}</p>
			</div>
		</template>

		<template #footer>
			<div v-if="action == 'delete'" class="flex-jend gap-4">
				<UButton color="neutral" variant="ghost" @click="onCancel">Cancel</UButton>
				<UButton color="error" variant="soft" :loading="loading" @click="onConfirm">Confirm</UButton>
			</div>

			<div v-else class="flex-jend gap-4">
				<UButton @click="onCancel">Cancel</UButton>
				<UButton :loading="loading" @click="onConfirm">Confirm</UButton>
			</div>
		</template>
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

const loading = ref(false);
const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = async () => {
	loading.value = true;
	emit('confirm');
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped></style>
