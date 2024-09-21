<template>
	<UFormGroup name="categories" class="mt-2">
		<USelectMenu
			v-model="categories"
			v-model:query="query"
			:options="options_categories"
			searchable
			size="md"
			value-attribute="name"
			option-attribute="name"
			multiple
		>
			<template #label>
				<span v-if="categories.length" class="truncate">{{ categories.join(', ') }}</span>
				<span v-else>Select Categories</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
const options_categories = [
	{
		id: 0,
		name: 'Spare Parts',
	},
	{
		id: 1,
		name: 'Services',
	},
];

const query = ref('');
const categories = ref([]);
</script>

<style></style>
