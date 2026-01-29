<template>
	<UForm :schema="LoginValidation" :state="state" class="space-y-4" @submit="onSubmit" @error="onError">
		<UCard variant="outline">
			<template #header>
				<div>
					<div class="flex sm:hidden w-full">
						<NuxtImg class="my-2 mx-auto w-full cursor-pointer rounded-sm" src="/logo/logo.png" alt="logo" />
					</div>
					<h1 class="text-center">CRM Merchant Login</h1>
				</div>
			</template>

			<div class="flex flex-col gap-2">
				<UFormField label="Merchant Id" name="merchant_id" required>
					<UInput v-model="state.merchant_id" />
				</UFormField>

				<UFormField label="Email" name="email_address" required>
					<UInput v-model="state.email_address" />
				</UFormField>

				<UFormField label="Password" name="password" required>
					<UInput v-model="state.password" :type="state.show ? 'text' : 'password'">
						<template v-if="state.password?.length" #trailing>
							<UButton
								color="neutral"
								variant="link"
								size="sm"
								:icon="state.show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
								:aria-label="state.show ? 'Hide password' : 'Show password'"
								:aria-pressed="state.show"
								aria-controls="password"
								@click="state.show = !state.show"
							/>
						</template>
					</UInput>
				</UFormField>
			</div>

			<template #footer>
				<div class="flex flex-col gap-2">
					<UButton block size="md" color="primary" variant="outline" type="submit" :loading="loading">Submit</UButton>
					<NuxtLink to="/forgot-password" class="text-center text-sm text-muted hover:underline">Forgot password?</NuxtLink>
				</div>
			</template>
		</UCard>
	</UForm>
</template>

<script lang="ts" setup>
import { LoginValidation } from '~/utils/schema';
import type { FormSubmitEvent, FormErrorEvent } from '#ui/types';
import type { z } from 'zod';

type Schema = z.output<typeof LoginValidation>;

const toast = useToast();
const state = reactive({
	merchant_id: undefined as string | undefined,
	email_address: undefined as string | undefined,
	password: undefined as string | undefined,
	show: false as boolean,
});

const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		const { merchant_id, email_address, password } = event.data;

		await authStore.login(merchant_id, email_address, password);

		navigateTo('/');
	} catch (error: any) {
		toast.add({
			title: 'Login Failed',
			description: error?.message || 'An error occurred during login',
			color: 'error',
		});
	}
};

const onError = async (event: FormErrorEvent) => {
	const firstError = event.errors[0];
	if (firstError?.name) {
		const element = document.getElementById(firstError.name);
		element?.focus();
		element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
};
</script>

<style scoped>
/* Hide the password reveal button in Edge */
::-ms-reveal {
	display: none;
}
</style>
