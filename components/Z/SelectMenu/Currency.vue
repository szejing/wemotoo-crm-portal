<template>
	<UFormGroup name="currencies" class="mt-2">
		<USelectMenu
			v-model="currency"
			v-model:query="query"
			:options="options_currencies"
			searchable
			size="md"
			value-attribute="name"
			option-attribute="name"
			:disabled="options_currencies.length == 1"
		>
			<template #label>
				<span v-if="currency" class="truncate">{{ currency }}</span>
				<span v-else class="text-gray-400">Select Currency</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
const options_currencies = [
	{
		id: 0,
		name: 'MYR',
	},
];

const query = ref('');
const currency = ref(options_currencies[0].name);
</script>

<style></style>
