<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[60%] md:w-[40%] lg:w-[30%]',
		}"
	>
		<UCard>
			<div class="space-y-2">
				<h3>{{ title }}</h3>
				<p>{{ message }}</p>
			</div>

			<template #footer>
				<div class="flex-jend gap-4">
					<UButton @click="onConfirm">Ok</UButton>
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
</script>

<style scoped></style>
