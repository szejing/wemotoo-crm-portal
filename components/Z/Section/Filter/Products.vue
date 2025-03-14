<template>
	<UCard>
		<UForm :schema="FilterProductValidation" :state="state" class="grid grid-cols-1 sm:grid-cols-4 gap-4" @submit="onSubmit">
			<UFormGroup name="query" class="col-span-2">
				<UInput v-model="state.query" placeholder="Search by Code / Name / Description..." :icon="ICONS.SEARCH_ROUNDED" />
			</UFormGroup>

			<div class="sm:col-start-4">
				<ZSelectMenuProductStatus v-model:status="state.status" />
			</div>
		</UForm>
	</UCard>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import type { ProductStatus } from '~/utils/enum/product-status';
import { FilterProductValidation } from '~/utils/schema';

type Schema = z.output<typeof FilterProductValidation>;

const state = ref<{ query: string | undefined; status: ProductStatus | undefined }>({
	query: undefined,
	status: undefined,
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
