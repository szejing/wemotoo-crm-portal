<template>
	<div class="flex-center w-full h-[50vh]">
		<div class="loader" />
	</div>
</template>

<script lang="ts" setup></script>

<style scoped lang="postcss">
/* HTML: <div class="loader"></div> */
.loader {
	width: 60px;
	aspect-ratio: 2;
	--_g: no-repeat radial-gradient(circle closest-side, #f37323 90%, #1c4c5b00);
	background: var(--_g) 0% 50%, var(--_g) 50% 50%, var(--_g) 100% 50%;
	background-size: calc(100% / 3) 50%;
	animation: l3 1s infinite linear;
}
@keyframes l3 {
	20% {
		background-position: 0% 0%, 50% 50%, 100% 50%;
	}
	40% {
		background-position: 0% 100%, 50% 0%, 100% 50%;
	}
	60% {
		background-position: 0% 50%, 50% 100%, 100% 0%;
	}
	80% {
		background-position: 0% 50%, 50% 50%, 100% 100%;
	}
}
</style>
