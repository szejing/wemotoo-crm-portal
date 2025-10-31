<template>
	<UFormField name="filter_type">
		<USelectMenu
			v-model="filter_type"
			:items="filterTypeItems"
			size="md"
			value-key="value"
			:ui="{ base: 'min-w-[200px]' }"
		/>
	</UFormField>
</template>

<script lang="ts" setup>
const date_filter_type_options = [
	{ name: 'Equal', value: '=' },
	{ name: 'Greater Than', value: '>' },
	{ name: 'Less Than', value: '<' },
	{ name: 'Greater Than or Equal', value: '>=' },
	{ name: 'Less Than or Equal', value: '<=' },
	{ name: 'Between', value: 'between' },
];

const filterTypeItems = computed(() => {
	return date_filter_type_options.map((option) => ({
		...option,
		label: option.name,
	}));
});

const props = defineProps<{ filterType: string }>();

const emit = defineEmits(['update:filterType']);

const filter_type = computed({
	get() {
		return props.filterType ?? '=';
	},
	set(filterType) {
		emit('update:filterType', filterType);
	},
});
</script>

<style scoped></style>
