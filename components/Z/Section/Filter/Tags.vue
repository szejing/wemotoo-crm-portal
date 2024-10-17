<template>
	<UForm :schema="FilterTagValidation" :state="state" @submit="onSubmit">
		<UFormGroup name="query">
			<UInput v-model="state.query" placeholder="Search by Tag" icon="i-material-symbols-search-rounded" />
		</UFormGroup>
	</UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { FilterTagValidation } from '~/utils/schema';

type Schema = z.output<typeof FilterTagValidation>;

const state = reactive({
	query: undefined,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { name } = event.data;

	console.log(name);

	// const authStore = useAuthStore();
	// authStore.login(email, password);
	// await navigateTo('/');
};
</script>

<style scoped lang="css"></style>
