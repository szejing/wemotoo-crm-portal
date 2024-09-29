<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Status</h3>
				<ZSelectMenuProductStatus />
			</template>
		</UCard>

		<!-- ***** Categories ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Categories</h3>
				<ZSelectMenuCategories />
			</template>
		</UCard>

		<!-- ***** Tags ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Tags</h3>
				<ZSelectMenuTags />
			</template>
		</UCard>

		<!-- ***** Image Thumbnails ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Image</h3>
			</template>
			<ZDropzoneSingle />
		</UCard>
		<!-- ***** Galleries ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Galleries</h3>
			</template>
			<ZDropzoneMultiple />
		</UCard>
	</div>
</template>

<script lang="ts" setup>
const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-sm' };
</script>

<style scoped lang="css">
h3 {
	@apply text-secondary-400;
}
</style>
