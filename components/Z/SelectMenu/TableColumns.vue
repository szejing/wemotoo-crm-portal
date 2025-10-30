<template>
	<USelectMenu
		v-model="selectedColumns"
		:options="props.columns"
		multiple
		:ui-menu="{
			width: 'w-50',
			height: 'max-h-40',
			base: 'overflow-y-auto scrollbar-hide',
		}"
	>
		<UButton icon="i-heroicons-view-columns" color="neutral" size="xs"> Show Columns </UButton>
	</USelectMenu>
</template>

<script lang="ts" setup>
const props = defineProps({
	columns: {
		type: Array as PropType<
			{
				key: string;
				label: string;
				sortable?: boolean;
			}[]
		>,
		required: true,
	},
	selectedColumns: {
		type: Array as PropType<
			{
				key: string;
				label: string;
				sortable?: boolean;
			}[]
		>,
		required: true,
	},
});

const selectedColumns = ref(props.columns);

const emit = defineEmits(['update:columns']);

watch(selectedColumns, (value) => {
	emit('update:columns', value);
});
</script>

<style scoped></style>
