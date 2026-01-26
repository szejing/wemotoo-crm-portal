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
			<div class="flex-jend gap-4">
				<UButton @click="onConfirm">Ok</UButton>
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

const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => {
	emit('confirm');
};
</script>

<style scoped></style>
