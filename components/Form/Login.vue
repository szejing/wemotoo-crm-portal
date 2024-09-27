<template>
	<div class="h-screen flex justify-center items-center">
		<div class="w-[80%] xs:w-[400px] sm:w-[420px]">
			<UForm :schema="LoginValidation" :state="state" class="space-y-4" @submit="onSubmit">
				<UCard>
					<template #header>
						<div class="w-full">
							<h1 class="text-center">Wemotoo CRM</h1>
							<img class="my-2 text-center mx-auto" src="../../assets/logo/logo.png" alt="logo" @click="navigateTo('/')" />
							<!-- <img class="w-[180px] mx-auto mt-2 text-center" src="../../assets/logo/logo.png" alt="logo" @click="navigateTo('/')" /> -->
						</div>
					</template>

					<div class="flex flex-col gap-2">
						<h1 class="text-center">Merchant Login</h1>
						<UFormGroup v-slot="{ error }" label="Email" name="email" required>
							<UInput v-model="state.email" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
						</UFormGroup>

						<UFormGroup v-slot="{ error }" label="Password" name="password" required>
							<UInput v-model="state.password" type="password" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
						</UFormGroup>
					</div>

					<template #footer>
						<UButton block size="md" color="primary" variant="outline" type="submit">Submit</UButton>
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
	email: undefined,
	password: undefined,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { email, password } = event.data;

	const authStore = useAuthStore();
	authStore.login(email, password);

	await navigateTo('/');
};
</script>

<style scoped lang="css"></style>
