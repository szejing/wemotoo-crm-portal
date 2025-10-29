<template>
	<div class="h-screen flex justify-center items-center">
		<div class="hidden sm:flex w-full h-full bg-main flex-col items-center justify-center">
			<img class="my-2 text-center mx-auto" src="../../assets/logo/logo.png" alt="logo" @click="navigateTo('/')" />
		</div>
		<div class="w-full sm:w-[60%] px-10">
			<UForm :schema="LoginValidation" :state="state" class="space-y-4" @submit="onSubmit">
				<UCard>
					<template #header>
						<div class="flex sm:hidden w-full">
							<img class="my-2 text-center mx-auto" src="../../assets/logo/logo.png" alt="logo" @click="navigateTo('/')" />
						</div>
					</template>

					<div class="flex flex-col gap-2">
						<h1 class="text-center">CRM Merchant Login</h1>
						<UFormField v-slot="{ error }" label="Merchant Id" name="merchant_id" required>
							<UInput v-model="state.merchant_id" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" />
						</UFormField>

						<UFormField v-slot="{ error }" label="Email" name="email_address" required>
							<UInput v-model="state.email_address" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" />
						</UFormField>

						<UFormField v-slot="{ error }" label="Password" name="password" required>
							<UInput v-model="state.password" type="password" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" />
						</UFormField>
					</div>

					<template #footer>
						<UButton block size="md" color="primary" variant="outline" type="submit" :loading="loading">Submit</UButton>
					</template>
				</UCard>
			</UForm>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { LoginValidation } from '~/utils/schema';
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';

type Schema = z.output<typeof LoginValidation>;

const state = reactive({
	merchant_id: undefined,
	email_address: undefined,
	password: undefined,
});

const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { merchant_id, email_address, password } = event.data;

	const authStore = useAuthStore();
	await authStore.login(merchant_id, email_address, password);

	navigateTo('/');
};
</script>

<style scoped lang="postcss"></style>
