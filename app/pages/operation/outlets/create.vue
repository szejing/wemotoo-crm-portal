<template>
	<ZPagePanel id="outlets-create" title="Create Outlet" back-to="/operation/outlets">
		<div class="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
			<div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
				<FormOutletCreation />
			</div>
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
const outletStore = useOutletStore();
const { new_outlet } = storeToRefs(outletStore);

const isDirty = computed(() => {
	const o = new_outlet.value;
	return !!(o.code || o.description || o.phone_no || o.address1 || o.city);
});

useLeavePageGuard(isDirty);
</script>

<style></style>
