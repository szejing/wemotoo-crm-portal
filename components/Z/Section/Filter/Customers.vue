<template>
	<UCard>
		<UForm :schema="FilterCustomerValidation" :state="state" class="grid grid-cols-4 gap-4" @submit="onSubmit">
			<UFormGroup name="query" class="col-span-2">
				<UInput v-model="state.query" placeholder="Search by Name / Phone No / Email..." :icon="ICONS.SEARCH_ROUNDED" />
			</UFormGroup>

			<UFormGroup name="status" class="col-start-4">
				<USelectMenu
					v-model="state.status"
					v-model:query="query"
					:items="options_account_status"
					searchable
					size="md"
					value-attribute="name"
					option-attribute="name"
					multiple
				>
					<template #label>
						<span v-if="state.status.length" class="truncate">{{ state.status.join(', ') }}</span>
						<span v-else>Account Status</span>
					</template>
				</USelectMenu>
			</UFormGroup>
		</UForm>
	</UCard>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { options_account_status } from '~/utils/options';
import { FilterCustomerValidation } from '~/utils/schema';

type Schema = z.output<typeof FilterCustomerValidation>;

const query = ref('');
const state = reactive({
	query: undefined,
	status: [] as string[],
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { name, phone, email, postal, country, status } = event.data;

	console.log(name, phone, email, postal, country, status);

	// const authStore = useAuthStore();
	// authStore.login(email, password);
	// await navigateTo('/');
};
</script>

<style scoped lang="css"></style>
