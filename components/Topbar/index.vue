<template>
	<div class="topbar-bg">
		<NuxtLink class="link" to="/login">
			<UIcon name="i-material-symbols-light-logout" class="text-neutral-900 w-6 h-6" />
		</NuxtLink>
	</div>
</template>

<script lang="ts" setup></script>

<style scoped lang="css">
.topbar-bg {
	@apply w-full h-14 bg-white flex justify-end items-center px-4;
}

.link {
	@apply bg-secondary-50 w-10 h-10 rounded-full text-center flex justify-center items-center;
}
</style>
