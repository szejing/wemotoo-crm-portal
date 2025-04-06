<template>
	<UForm :schema="FilterCategoryValidation" :state="state" @submit="onSubmit">
		<UFormGroup name="query">
			<UInput v-model="state.query" placeholder="Search by Code / Name / Description..." :icon="ICONS.SEARCH_ROUNDED" />
		</UFormGroup>
	</UForm>
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

<style scoped lang="postcss"></style>
