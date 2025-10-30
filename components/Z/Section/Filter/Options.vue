<template>
	<UForm :schema="FilterOptionValidation" :state="state" @submit="onSubmit">
		<UFormField name="query">
			<UInput v-model="state.query" placeholder="Search by Name / Value..." :icon="ICONS.SEARCH_ROUNDED" />
		</UFormField>
	</UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { FilterOptionValidation } from '~/utils/schema';

type Schema = z.output<typeof FilterOptionValidation>;

const state = reactive({
	query: undefined,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { name, value } = event.data;

	console.log(name, value);
};
</script>

<style scoped></style>
