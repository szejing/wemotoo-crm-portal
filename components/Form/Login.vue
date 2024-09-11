<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { LoginValidation } from '~/utils/schema/LoginValidation';

const { handleSubmit } = useForm({
	validationSchema: LoginValidation,
});

const onSubmit = handleSubmit((values) => {
	alert(JSON.stringify(values, null, 2));
});
</script>

<template>
	<div class="h-screen flex justify-center items-center">
		<form @submit="onSubmit">
			<div class="sm:w-[180px] md:w-[400px]">
				<UCard>
					<template #header>
						<div class="w-full">
							<h1 class="font-nunito font-semibold text-2xl text-center">Wemotoo CRM</h1>
							<img class="my-2 text-center" src="../../assets/logo/logo.png" alt="logo" @click="navigateTo('/')" />
							<!-- <img class="w-[180px] mx-auto mt-2 text-center" src="../../assets/logo/logo.png" alt="logo" @click="navigateTo('/')" /> -->
						</div>
					</template>
					<h1 class="font-nunito text-2xl text-secondary text-center">Merchant Login</h1>
					<Placeholder class="h-4" />

					<InputTextField label="Email Address" type="email" name="email" value="email" place-holder="abc@wemotoo.com" />
					<Placeholder class="h-4" />
					<InputTextField label="Password" type="password" name="password" value="password" />

					<template #footer>
						<UButton block size="md" color="primary" variant="outline" @click="onSubmit">Submit</UButton>
					</template>
				</UCard>
			</div>
		</form>
	</div>
</template>

<style></style>
