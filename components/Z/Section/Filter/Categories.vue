<template>
	<UCard>
		<UForm :schema="FilterCategoryValidation" :state="state" class="grid grid-cols-4 gap-4" @submit="onSubmit">
			<UFormGroup label="Keyword" name="query" class="col-span-2">
				<UInput v-model="state.query" placeholder="Search by Code / Name / Description..." icon="i-material-symbols-search-rounded" />
			</UFormGroup>
		</UForm>
	</UCard>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { FilterCategoryValidation } from '~/utils/schema';

type Schema = z.output<typeof FilterCategoryValidation>;

const state = reactive({
	query: undefined,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, name, description } = event.data;

	console.log(code, name, description);

	// const authStore = useAuthStore();
	// authStore.login(email, password);
	// await navigateTo('/');
};
</script>

<style scoped lang="css"></style>
