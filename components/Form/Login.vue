<template>
	<div class="h-screen flex justify-center items-center">
		<div class="w-[80%] xs:w-[400px] sm:w-[420px]">
			<UForm :schema="LoginValidation" :state="state" class="space-y-4" @submit="onSubmit">
				<UCard>
					<template #header>
						<div class="w-full">
							<h1 class="text-center">Wemotoo CRM</h1>
							<img class="my-2 text-center mx-auto" src="../../assets/logo/logo.png" alt="logo" @click="navigateTo('/')" />
						</div>
					</template>

					<div class="flex flex-col gap-2">
						<h1 class="text-center">Merchant Login</h1>
						<UFormGroup v-slot="{ error }" label="Merchant Id" name="merchant_id" required>
							<UInput v-model="state.merchant_id" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" @input="clearError" />
						</UFormGroup>

						<UFormGroup v-slot="{ error }" label="Email" name="email_address" required>
							<UInput v-model="state.email_address" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" @input="clearError" />
						</UFormGroup>

						<UFormGroup v-slot="{ error }" label="Password" name="password" required>
							<UInput
								v-model="state.password"
								type="password"
								:trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
								@input="clearError"
							/>
						</UFormGroup>
					</div>

					<template #footer>
						<UButton block size="md" color="primary" variant="outline" type="submit" :loading="loading">Submit</UButton>
					</template>
				</UCard>
			</UForm>

			<!-- <div v-if="errors.length > 0" class="mt-4">
				<UAlert
					v-for="(error, index) in errors"
					:key="index"
					icon="material-symbols-warning-outline-rounded"
					color="red"
					variant="solid"
					:title="error"
					:close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
					@close="clearError(index)"
				/>
			</div> -->
		</div>
	</div>
</template>

<script lang="ts" setup>
import { LoginValidation } from '~/utils/schema';
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import type { EventNotification } from '~/utils/types/event-notification';

type Schema = z.output<typeof LoginValidation>;

const state = reactive({
	merchant_id: undefined,
	email_address: undefined,
	password: undefined,
});

const authStore = useAuthStore();
const { loading, errors } = storeToRefs(authStore);
const toast = useToast();

watch(errors.value, () => {
	if (errors.value.length > 0) {
		errors.value.forEach((en: EventNotification) => {
			toast.add({
				id: en.id,
				color: en.color,
				title: en.title,
				description: en.description,
				icon: en.icon,
				timeout: en.timeout,
				// actions: en.actions,
			});
		});
	}
});

const clearError = (index: number) => {
	authStore.clearErrors(index);
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { merchant_id, email_address, password } = event.data;

	const authStore = useAuthStore();
	await authStore.login(merchant_id, email_address, password);

	navigateTo('/');
};
</script>

<style scoped lang="css"></style>
