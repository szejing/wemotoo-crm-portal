<template>
	<UDashboardPanel id="home">
		<template #header>
			<UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>

				<template #right>
					<UDropdownMenu :items="items">
						<UButton icon="i-lucide-plus" size="md" class="rounded-full" />
					</UDropdownMenu>
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<DashboardDateRangePicker v-model="range" class="-ms-1" />
					<DashboardPeriodSelect v-model="period" :range="range" />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<DashboardStats />
			<DashboardOrderAmtChart />
			<DashboardOrders />
		</template>
	</UDashboardPanel>
</template>

<script setup lang="ts">
import { sub } from 'date-fns';
import type { DropdownMenuItem } from '@nuxt/ui';
import type { Period } from '~/utils/types/period';
import type { Range } from '~/utils/interface';

const items = [
	[
		{
			label: 'New mail',
			icon: 'i-lucide-send',
			to: '/inbox',
		},
		{
			label: 'New customer',
			icon: 'i-lucide-user-plus',
			to: '/customers',
		},
	],
] satisfies DropdownMenuItem[][];

const range = shallowRef<Range>({
	start: sub(new Date(), { days: 14 }),
	end: new Date(),
});
const period = ref<Period>('daily');
</script>
