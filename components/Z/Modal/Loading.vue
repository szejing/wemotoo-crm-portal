<template>
	<UModal :fullscreen="fullscreen" :ui="{ background: 'bg-transparent', shadow: 'none' }">
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

<style scoped lang="postcss"></style>
