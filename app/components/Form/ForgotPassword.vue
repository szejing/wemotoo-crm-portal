<template>
	<UForm :schema="ForgotPasswordValidation" :state="state" class="space-y-4" @submit="onSubmit" @error="onError">
		<UCard variant="outline">
			<template #header>
				<div>
					<div class="flex sm:hidden w-full">
						<NuxtImg class="my-2 mx-auto w-full cursor-pointer rounded-sm" src="/logo/logo.png" alt="logo" />
					</div>
					<h1 class="text-center">Forgot Password</h1>
					<p class="text-center text-sm text-muted mt-1">Enter your email and we’ll send you a reset link.</p>
				</div>
			</template>

			<div v-if="success" class="rounded-md bg-success/10 text-success px-3 py-3 text-sm">
				We have successfully sent you a reset link to your email {{ state.email_address }}. Please check your inbox.
			</div>

			<div v-else-if="success === false" class="rounded-md bg-error/10 text-error px-3 py-3 text-sm">{{ errorMessage }}</div>

			<template v-else>
				<div class="flex flex-col gap-2">
					<UFormField label="Merchant Id" name="merchant_id" required>
						<UInput v-model="state.merchant_id" autocomplete="merchant_id" />
					</UFormField>

					<UFormField label="Email" name="email_address" required>
						<UInput v-model="state.email_address" placeholder="you@example.com" autocomplete="email" />
					</UFormField>
				</div>
			</template>

			<template #footer>
				<div class="flex flex-col gap-2">
					<UButton v-if="!success" block size="md" color="primary" variant="outline" type="submit" :loading="loading" :disabled="countdown > 0">
						{{ countdown > 0 ? `Resend in ${countdown}s` : 'Send reset link' }}
					</UButton>
					<NuxtLink to="/login" class="text-center text-sm text-muted hover:underline">Back to login</NuxtLink>
				</div>
			</template>
		</UCard>
	</UForm>
</template>

<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { ForgotPasswordValidation } from '~/utils/schema';
import type { FormSubmitEvent, FormErrorEvent } from '#ui/types';
import type { z } from 'zod';

type Schema = z.output<typeof ForgotPasswordValidation>;

const state = reactive({
	merchant_id: undefined as string | undefined,
	email_address: undefined as string | undefined,
});
const success = ref(undefined as boolean | undefined);
const loading = ref(false);
const countdown = ref(0);
const errorMessage = ref('');
let countdownInterval: NodeJS.Timeout | null = null;

const startCountdown = () => {
	countdown.value = 60;
	if (countdownInterval) {
		clearInterval(countdownInterval);
	}
	countdownInterval = setInterval(() => {
		countdown.value--;
		if (countdown.value <= 0) {
			if (countdownInterval) {
				clearInterval(countdownInterval);
				countdownInterval = null;
			}
		}
	}, 1000);
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	loading.value = true;
	try {
		const authStore = useAuthStore();
		const result: [boolean, string] = await authStore.forgotPassword(event.data.merchant_id, event.data.email_address);
		success.value = result[0];
		if (!result[0]) {
			errorMessage.value = result[1];
			startCountdown();
		}
	} catch (err: any) {
		console.error(err);
		success.value = false;
	} finally {
		loading.value = false;
	}
};

const onError = (event: FormErrorEvent) => {
	const firstError = event.errors[0];
	if (firstError?.name) {
		const el = document.getElementById(firstError.name);
		el?.focus();
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
};

onUnmounted(() => {
	if (countdownInterval) {
		clearInterval(countdownInterval);
	}
});
</script>
