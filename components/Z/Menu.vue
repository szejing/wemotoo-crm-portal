<template>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-4">
		<UButton v-for="(navigate, index) in props.navigations" :key="index" variant="ghost" color="gray" :to="navigate.to">
			<div class="flex flex-col items-center gap-2 mx-auto text-center py-4">
				<UIcon size="24" :name="navigate.icon" />
				<span>{{ navigate.title }}</span>
			</div>
		</UButton>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	navigations: {
		title: string;
		icon: string;
		to: string;
	}[];
}>();
</script>

<style scoped lang="postcss"></style>
