<template>
	<UDashboardPanel id="payment">
		<template #header>
			<UDashboardNavbar title="Payment Management" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Payment Management</h2>
					<p class="text-gray-600 dark:text-gray-400">Configure payment types and methods for your business</p>
				</div>

				<!-- Payment Configuration Section -->
				<div class="space-y-4">
					<div class="flex items-center gap-3">
						<UIcon :name="ICONS.PAYMENT_METHODS" class="text-2xl text-blue-500" />
						<div>
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Payment Configuration</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400">Set up and manage payment options</p>
						</div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<UCard
							v-for="(navigate, index) in payment_navigations"
							:key="index"
							:to="navigate.to"
							class="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
						>
							<div class="flex items-start gap-4">
								<div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
									<UIcon :name="navigate.icon" class="text-2xl text-blue-600 dark:text-blue-400" />
								</div>
								<div class="flex-1">
									<h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ navigate.title }}</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">{{ navigate.description }}</p>
								</div>
								<UIcon name="i-heroicons-arrow-right" class="text-gray-400 dark:text-gray-500" />
							</div>
						</UCard>
					</div>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
useHead({ title: 'Wemotoo CRM - Payment' });

const payment_navigations = [
	{
		title: 'Payment Type',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/types',
		description: 'Define payment types like cash, credit card, digital wallet',
	},
	{
		title: 'Payment Method',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/methods',
		description: 'Configure specific payment methods and providers',
	},
];
</script>

<style scoped></style>
