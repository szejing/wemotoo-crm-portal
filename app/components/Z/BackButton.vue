<template>
	<UButton variant="ghost" color="neutral" :icon="ICONS.ARROW_LEFT" :aria-label="$t('components.backButton.backToPreviousPage')" @click="goBack" />
</template>

<script lang="ts" setup>
const router = useRouter();

const props = withDefaults(
	defineProps<{
		/** When there is no history (e.g. direct load), navigate here instead of leaving the app. */
		fallbackTo?: string;
	}>(),
	{ fallbackTo: '/' },
);

function goBack() {
	if (import.meta.client && window.history.length <= 1) {
		navigateTo(props.fallbackTo);
	} else {
		router.back();
	}
}
</script>
