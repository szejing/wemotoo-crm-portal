<template>
	<div>
		<FormLogin />

		<LazyUModal v-model="isOpen">
			<UCard> {{ errors.join(',') }}</UCard>
		</LazyUModal>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	layout: 'auth',
});

const authStore = useAuthStore();
const { errors } = storeToRefs(authStore);

const isOpen = computed({
	get() {
		return errors.value.length > 0;
	},
	set(_) {
		errors.value = [];
	},
});
</script>

<style scoped lang="css"></style>
