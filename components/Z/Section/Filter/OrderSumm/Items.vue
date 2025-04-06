<template>
	<UCard>
		<UForm :schema="FilterOrderValidation" :state="state" class="grid grid-cols-1 sm:grid-cols-4 gap-4" @submit="onSubmit">
			<UFormGroup name="query" class="col-span-2">
				<UInput v-model="state.query" placeholder="Search by Code / Name / Description..." :icon="ICONS.SEARCH_ROUNDED" />
			</UFormGroup>

			<div class="sm:col-start-4">
				<ZSelectMenuOrderStatus v-model:status="state.status" />
			</div>
		</UForm>
	</UCard>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import type { OrderStatus } from 'wemotoo-common';
import { FilterOrderValidation } from '~/utils/schema';

type Schema = z.output<typeof FilterOrderValidation>;

const state = ref<{ query: string | undefined; status: OrderStatus | undefined }>({
	query: undefined,
	status: undefined,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { orderNo, customerName } = event.data;

	console.log(orderNo, customerName);

	// const authStore = useAuthStore();
	// authStore.login(email, password);
	// await navigateTo('/');
};
</script>

<style scoped lang="postcss"></style>
