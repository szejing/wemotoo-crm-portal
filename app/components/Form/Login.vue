<template>
	<UForm :schema="loginSchema" :state="state" class="w-full space-y-4" @submit="onSubmit" @error="onError">
		<UCard variant="outline" class="w-full">
			<template #header>
				<div>
					<div class="flex sm:hidden w-full">
						<NuxtImg class="my-2 mx-auto w-full cursor-pointer rounded-sm" src="/logo/logo.png" alt="logo" />
					</div>
					<h1 class="text-center">{{ $t('auth.loginTitle') }}</h1>
				</div>
			</template>

			<div class="flex flex-col gap-2">
				<UFormField :label="$t('auth.merchantId')" name="section_merchant_id" required>
					<UInput :model-value="state.merchant_id" autocomplete="section-login organization" @update:model-value="setMerchantId" />
				</UFormField>

				<UFormField :label="$t('auth.email')" name="email_address" required>
					<UInput v-model="state.email_address" autocomplete="section-login email" />
				</UFormField>

				<UFormField :label="$t('auth.password')" name="password" required>
					<UInput v-model="state.password" :type="state.show ? 'text' : 'password'">
						<template v-if="state.password?.length" #trailing>
							<UButton
								color="neutral"
								variant="link"
								size="sm"
								:icon="state.show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
								:aria-label="state.show ? $t('common.hidePassword') : $t('common.showPassword')"
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
					<UButton block size="md" color="primary" variant="outline" type="submit" :loading="loading">{{ $t('common.submit') }}</UButton>
					<NuxtLink to="/forgot-password" class="text-center text-sm text-muted hover:underline">{{ $t('auth.forgotPassword') }}</NuxtLink>
				</div>
			</template>
		</UCard>
	</UForm>
</template>

<script lang="ts" setup>
import { LoginValidation } from '~/utils/schema';
import type { FormSubmitEvent, FormErrorEvent } from '#ui/types';
import type { z } from 'zod';

const { t } = useI18n();
const loginSchema = computed(() => LoginValidation(t));

type Schema = z.infer<ReturnType<typeof LoginValidation>>;

const state = reactive({
	merchant_id: undefined as string | undefined,
	email_address: undefined as string | undefined,
	password: undefined as string | undefined,
	show: false as boolean,
});

const setMerchantId = (value: string | undefined) => {
	state.merchant_id = value ? value.toUpperCase() : undefined;
};

const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { merchant_id, email_address, password } = event.data;

	const success = await authStore.login(merchant_id, email_address, password);

	if (success) {
		navigateTo('/');
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
