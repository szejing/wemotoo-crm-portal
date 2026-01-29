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
			<div class="flex justify-between gap-4 w-full">
				<UButton color="primary" variant="outline" @click="onStay">Stay</UButton>
				<UButton color="neutral" variant="outline" @click="onLeave">Leave</UButton>
			</div>
		</template>
	</UModal>
</template>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		title?: string;
		message?: string;
		onStay?: () => void;
		onLeave?: () => void;
	}>(),
	{
		title: 'Leave page?',
		message: 'You have unsaved changes. Are you sure you want to leave?',
	},
);

const emit = defineEmits<{ stay: []; leave: [] }>();

const onStay = () => {
	props.onStay?.();
	emit('stay');
};

const onLeave = () => {
	props.onLeave?.();
	emit('leave');
};
</script>
