<template>
	<UCard>
		<div class="w-full">
			<UForm :schema="FilterOrderValidation" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
				<div class="flex-jbetween-icenter w-full sm:w-[60%]">
					<h4>Date</h4>
					<ZSelectMenuDateFilterType v-model:filter-type="state.filterType" />

					<ZSelectMenuOrderStatus v-model:status="state.status" />
				</div>
				<div class="flex-jbetween-icenter w-full sm:w-[60%]">
					<h4>Order Status</h4>
					<ZSelectMenuOrderStatus v-model:status="state.status" />
				</div>
			</UForm>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';

type Schema = z.output<typeof FilterSummOrderValidation>;

const state = ref<{ startDate: string | undefined; endDate: string | undefined; filterType: string }>({
	startDate: undefined,
	endDate: undefined,
	filterType: '=',
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { startDate, endDate, filterType } = event.data;

	console.log(startDate, endDate, filterType);

	// const authStore = useAuthStore();
	// authStore.login(email, password);
	// await navigateTo('/');
};
</script>

<style scoped lang="postcss"></style>
