<template>
	<UModal
		:fullscreen="fullscreen"
		:ui="{
			overlay: 'bg-black/70',
			content: 'shadow-none bg-transparent border-none ring-0',
		}"
		prevent-close
	>
		<template #content>
			<ZLoading class="h-full w-full" />
		</template>
	</UModal>
</template>

<script lang="ts" setup>
defineProps({
	fullscreen: {
		type: Boolean,
		default: false,
	},
});
</script>

<style scoped></style>
