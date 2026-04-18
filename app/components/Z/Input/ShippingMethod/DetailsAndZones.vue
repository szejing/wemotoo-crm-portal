<template>
	<div class="space-y-6">
		<UCard id="section-shipping-method-details" class="shadow-md scroll-mt-4">
			<template #header>
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<UIcon :name="ICONS.ORDER" class="text-primary-500 w-6 h-6" />
							<h2 class="text-xl font-semibold">{{ $t('pages.shippingMethodDetails') }}</h2>
						</div>
						<p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ $t('components.shippingMethodForm.detailsSectionSubtitle') }}</p>
					</div>
				</div>
			</template>

			<div class="space-y-6 py-2 px-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<UFormField :label="$t('common.name')" class="sm:col-span-2">
						<UInput v-model="state.name" />
					</UFormField>

					<UFormField :label="$t('components.shipment.shippingFee')">
						<UInput v-model.number="state.fee" type="number" min="0" step="0.01">
							<template #leading>
								<span class="text-muted text-sm tabular-nums select-none">{{ feeCurrencyPrefix }}</span>
							</template>
						</UInput>
					</UFormField>

					<UFormField :label="$t('pages.estimatedDays')">
						<UInput v-model.number="state.estimated_days" type="number" min="0" step="1" />
					</UFormField>

					<UFormField :label="$t('common.status')">
						<USwitch v-model="state.is_active" :label="$t(state.is_active ? 'common.active' : 'common.inactive')" />
					</UFormField>
				</div>
			</div>
		</UCard>

		<UCard id="section-shipping-zones" class="shadow-md scroll-mt-4">
			<template #header>
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-6 h-6" />
							<h2 class="text-xl font-semibold">{{ $t('components.shippingMethodForm.regionsSectionTitle') }}</h2>
						</div>
						<p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ $t('components.shippingMethodForm.regionsSectionSubtitle') }}</p>
					</div>
				</div>
			</template>

			<div class="space-y-6 py-2 px-4">
				<p class="text-xs text-neutral-500 dark:text-neutral-400">
					{{ $t('pages.shippingZonesSectionHint') }}
				</p>

				<div class="space-y-4">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<div class="flex min-w-0 items-center gap-2">
							<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-5 h-5 shrink-0" />
							<h3 class="text-base font-semibold text-highlighted">{{ $t('pages.shippingZones') }}</h3>
						</div>
						<UButton type="button" size="xs" variant="soft" @click="addZoneRow">
							{{ $t('pages.addShippingZone') }}
						</UButton>
					</div>

					<UCard
						v-for="(row, idx) in state.zone_rows"
						:key="idx"
						class="space-y-3 border border-default shadow-sm scroll-mt-4"
					>
						<div class="grid gap-3 sm:grid-cols-2">
							<UFormField :label="$t('pages.shippingZoneCountry')">
								<UInput v-model="row.country_code" maxlength="2" class="uppercase" />
							</UFormField>
							<UFormField :label="$t('pages.shippingZoneState')">
								<UInput v-model="row.state" />
							</UFormField>
						</div>
						<UFormField :label="$t('pages.shippingZonePostcodes')">
							<UTextarea v-model="row.postcodes_text" :rows="3" autoresize />
						</UFormField>
						<div class="grid gap-3 sm:grid-cols-2">
							<UFormField :label="$t('pages.shippingZoneRulePriority')">
								<UInput v-model.number="row.rule_priority" type="number" min="0" step="1" />
							</UFormField>
							<UFormField :label="$t('pages.shippingZoneFeeOverride')">
								<UInput v-model.number="row.fee_override" type="number" min="0" step="0.01" />
							</UFormField>
						</div>
						<UFormField :label="$t('pages.shippingZoneDaysOverride')">
							<UInput v-model.number="row.estimated_days_override" type="number" min="0" step="1" />
						</UFormField>
						<div class="flex items-center justify-between gap-2">
							<USwitch v-model="row.is_default" :label="$t('pages.shippingZoneDefault')" />
							<UButton v-if="state.zone_rows.length > 1" type="button" size="xs" color="error" variant="ghost" @click="removeZoneRow(idx)">
								{{ $t('pages.removeShippingZone') }}
							</UButton>
						</div>
					</UCard>
				</div>
			</div>
		</UCard>
	</div>
</template>

<script setup lang="ts">
import { ICONS } from '~/utils/icons';

type ZoneFormRow = {
	country_code: string;
	state: string;
	postcodes_text: string;
	rule_priority: number;
	is_default: boolean;
	fee_override?: number;
	estimated_days_override?: number;
};

type ShippingMethodFormState = {
	name: string;
	fee: number;
	estimated_days?: number;
	priority: number;
	is_active: boolean;
	zone_rows: ZoneFormRow[];
};

const props = withDefaults(
	defineProps<{
		state: ShippingMethodFormState;
		/** ISO currency code for the fee field prefix (matches merchant / review formatting). */
		currencyCode?: string;
	}>(),
	{ currencyCode: 'MYR' },
);

const state = toRef(props, 'state');

const feeCurrencyPrefix = computed(() => (props.currencyCode === 'MYR' ? 'RM' : props.currencyCode));

const emptyZoneRow = (): ZoneFormRow => ({
	country_code: '',
	state: '',
	postcodes_text: '',
	rule_priority: 0,
	is_default: false,
	fee_override: undefined,
	estimated_days_override: undefined,
});

const addZoneRow = () => {
	state.value.zone_rows.push(emptyZoneRow());
};

const removeZoneRow = (idx: number) => {
	state.value.zone_rows.splice(idx, 1);
	if (state.value.zone_rows.length === 0) {
		state.value.zone_rows.push(emptyZoneRow());
	}
};
</script>
