<template>
	<UCard>
		<UForm :schema="ProductFilterValidation" :state="state" class="grid grid-cols-4 gap-4" @submit="onSubmit">
			<UFormGroup label="Keyword" name="query" class="col-span-2">
				<UInput v-model="state.query" placeholder="Search by Code / Name / Description..." icon="i-material-symbols-search-rounded" />
			</UFormGroup>

			<UFormGroup label="Status" name="status" class="col-start-4">
				<USelectMenu
					v-model="state.status"
					v-model:query="query"
					:options="options_product_status"
					searchable
					size="md"
					value-attribute="name"
					option-attribute="name"
					multiple
				>
					<template #label>
						<span v-if="state.status.length" class="truncate">{{ state.status.join(', ') }}</span>
						<span v-else>Select Status</span>
					</template>
				</USelectMenu>
			</UFormGroup>
		</UForm>
	</UCard>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { options_product_status } from '~/utils/options';
import { ProductFilterValidation } from '~/utils/schema';

type Schema = z.output<typeof ProductFilterValidation>;

const query = ref('');
const state = reactive({
	query: undefined,
	status: [] as string[],
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, name, description, tag } = event.data;

	console.log(code, name, description, tag);

	// const authStore = useAuthStore();
	// authStore.login(email, password);
	// await navigateTo('/');
};
</script>

<style></style>
