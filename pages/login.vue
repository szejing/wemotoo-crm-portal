<template>
	<div class="h-screen flex justify-center items-center">
		<div class="hidden sm:flex w-full h-full bg-main flex-col items-center justify-center">
			<NuxtImg class="my-2 text-center mx-auto w-100" src="/logo/logo.png" alt="logo" @click="navigateTo('/')" />
		</div>
		<div class="w-full sm:w-[60%] px-10">
			<FormLogin />
		</div>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'auth' });

useHead({ title: 'Wemotoo CRM - Login' });
</script>

<style scoped></style>
