<template>
	<UModal
		:ui="{
			content: 'w-full sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%]',
		}"
	>
		<template #header>
			<h3 class="text-lg font-bold">{{ title }}</h3>
		</template>

		<template #body>
			<p>{{ message }}</p>
		</template>

		<template #footer>
			<div v-if="action == 'delete'" class="flex justify-between gap-4 w-full">
				<UButton color="neutral" variant="outline" @click="onCancel">Cancel</UButton>
				<UButton color="error" variant="ghost" class="opacity-50 hover:opacity-100" :loading="loading" @click="onConfirm">Confirm</UButton>
			</div>

			<div v-else class="flex justify-between gap-4 w-full">
				<UButton color="neutral" variant="outline" @click="onCancel">Cancel</UButton>
				<UButton color="success" :loading="loading" @click="onConfirm">Confirm</UButton>
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
