<template>
	<UFormGroup name="tags" class="mt-2">
		<USelectMenu v-model="tags" v-model:query="query" :options="options_tags" searchable size="md" value-attribute="name" option-attribute="name" multiple>
			<template #label>
				<span v-if="tags.length" class="truncate">{{ tags.join(', ') }}</span>
				<span v-else>Select Tags</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
const options_tags = [
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
const tags = ref([]);
</script>

<style></style>
