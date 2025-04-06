<template>
	<UFormField name="filter_type" class="mt-2">
		<USelectMenu v-model="filter_type" :options="date_filter_type_options" size="md" option-attribute="name" value-attribute="value" />
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

<style scoped lang="postcss"></style>
