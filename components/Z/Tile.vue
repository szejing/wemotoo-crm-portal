<template>
	<div class="tile-container">
		<NuxtImg
			format="webp"
			:src="thumbnailUrl"
			width="60"
			height="60"
			class="rounded-[50%]"
			preload
			:class="[onClickThumbnail ? 'cursor-pointer' : '']"
			@click="onClickThumbnail"
		/>
		<div class="inner-tile-container">
			<h2 class="font-medium text-secondary-100" :class="[onClickTitle ? 'cursor-pointer' : '']" :onclick="onClickTitle">{{ title }}</h2>
			<p class="text-sm text-secondary-400" :class="[onClickSubtitle ? 'cursor-pointer' : '']" :onclick="onClickSubtitle">{{ subtitle }}</p>
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
	onClickThumbnail: {
		type: Function,
		default: undefined,
	},
	onClickTitle: {
		type: Function,
		default: undefined,
	},
	onClickSubtitle: {
		type: Function,
		default: undefined,
	},
});

const { title, subtitle, thumbnailUrl } = props;
</script>

<style scoped lang="postcss">
.tile-container {
	@apply flex justify-start items-center gap-2;
}

.inner-tile-container {
	@apply flex flex-col justify-center items-start;
}
</style>
