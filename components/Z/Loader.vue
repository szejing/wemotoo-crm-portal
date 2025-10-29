<template>
	<div
		v-motion
		:initial="{ opacity: 0 }"
		:enter="{
			opacity: 1,
			transition: {
				repeat: Infinity,
				repeatType: 'mirror',
			},
		}"
		:duration="1000"
	>
		<NuxtImg src="/logo/logo.png" alt="logo" />
	</div>
</template>

<script lang="ts" setup></script>

<style scoped lang="postcss"></style>
