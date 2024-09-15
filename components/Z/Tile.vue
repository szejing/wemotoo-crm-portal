<template>
	<div class="tile-container">
		<NuxtImg format="webp" :src="thumbnailUrl" width="60" height="60" class="rounded-[50%]" />
		<div class="inner-tile-container">
			<h1 class="text-xl font-medium text-secondary-100">{{ title }}</h1>
			<p class="text-sm text-secondary-400">{{ subtitle }}</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
	},
	thumbnailUrl: {
		type: String,
		required: true,
	},
});

const { title, subtitle, thumbnailUrl } = props;
</script>

<style scoped lang="css">
.tile-container {
	@apply flex justify-start items-center gap-2;
}

.inner-tile-container {
	@apply flex flex-col justify-center items-start;
}
</style>
