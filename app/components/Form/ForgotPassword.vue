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
				If an account exists for that email, you will receive instructions to reset your password. Please check your inbox.
			</div>

			<template v-else>
				<div class="flex flex-col gap-2">
					<UFormField label="Email" name="email" required>
						<UInput v-model="state.email" type="email" placeholder="you@example.com" autocomplete="email" />
					</UFormField>
				</div>
			</template>

			<template v-if="!success" #footer>
				<div class="flex flex-col gap-2">
					<UButton block size="md" color="primary" variant="outline" type="submit" :loading="loading">
						Send reset link
					</UButton>
					<NuxtLink to="/login" class="text-center text-sm text-muted hover:underline">Back to login</NuxtLink>
				</div>
			</template>
		</UCard>
	</UForm>
</template>

<script lang="ts" setup>
import { ForgotPasswordValidation } from '~/utils/schema';
import type { FormSubmitEvent, FormErrorEvent } from '#ui/types';
import type { z } from 'zod';

type Schema = z.output<typeof ForgotPasswordValidation>;

const toast = useToast();
const state = reactive({ email: '' });
const success = ref(false);
const loading = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	loading.value = true;
	try {
		const { $api } = useNuxtApp();
		await $api.auth.forgotPassword({ email: event.data.email });
		success.value = true;
	} catch (_err) {
		// Always show the same generic message so we don’t reveal account existence
		toast.add({
			title: 'Request submitted',
			description: 'If an account exists for that email, you will receive instructions to reset your password.',
			color: 'neutral',
		});
		success.value = true;
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
</script>
