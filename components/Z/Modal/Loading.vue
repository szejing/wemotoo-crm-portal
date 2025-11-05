<template>
	<UModal :fullscreen="fullscreen" :ui="{ overlay: 'bg-transparent', content: 'shadow-none' }" prevent-close>
		<ZLoading class="h-full w-full" />
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
