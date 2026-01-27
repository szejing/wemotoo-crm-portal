<template>
	<div class="h-screen flex justify-center items-center">
		<div class="hidden sm:flex w-full h-full bg-main flex-col items-center justify-center">
			<img class="my-2 text-center mx-auto w-100" src="/logo/logo.png" alt="logo" @click="navigateTo('/')" />
		</div>
		<div class="w-full sm:w-[60%] px-10">
			<FormForgotPassword />
		</div>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'auth' });

useHead({ title: 'Wemotoo CRM - Forgot Password' });
</script>
