<template>
	<div class="text-base font-nunito font-medium min-h-20">
		<div :class="['mb-1', disabled ? 'text-neutral-500' : value ? (errorMessage ? 'text-red-600' : 'text-neutral-800') : '']">
			{{ label }}
		</div>

		<USelectMenu
			v-slot="{ open }"
			v-model="selected"
			v-model:query="query"
			:options="people"
			:placeholder="placeHolder"
			searchable
			value-attribute="name"
			option-attribute="name"
			:multiple="multiple"
		>
			<UButton color="gray" :ui="{ base: '' }" class="flex-1 justify-between">
				{{ selected }}

				<UIcon
					name="i-heroicons-chevron-right-20-solid"
					class="w-5 h-5 transition-transform text-gray-400 dark:text-gray-500"
					:class="[open && 'transform rotate-90']"
				/>
			</UButton>
		</USelectMenu>
	</div>
</template>

<script lang="ts" setup>
import { useField } from 'vee-validate';

const props = defineProps({
	icon: String,
	label: String,
	value: String,
	name: String,
	placeHolder: String,
	disabled: {
		type: Boolean || null,
		default: null,
	},
	searchable: {
		type: Boolean || null,
		default: true,
	},
	multiple: {
		type: Boolean || null,
		default: false,
	},
});

const people = [
	{
		id: 1,
		name: 'Wade Cooper',
	},
	{
		id: 2,
		name: 'Arlene Mccoy',
	},
	{
		id: 3,
		name: 'Devon Webb',
	},
	{
		id: 4,
		name: 'Tom Cook',
	},
];

const selected = ref(people[0].name);
const query = ref('');

const { value, errorMessage } = useField(() => props.name ?? '');

const label = ref<string>(props.label ?? '');
const placeHolder = ref<string>(props.placeHolder ?? label.value);
</script>

<style scoped lang="css"></style>
