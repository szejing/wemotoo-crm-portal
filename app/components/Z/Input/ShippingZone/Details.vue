<template>
	<div class="space-y-6">
		<UCard id="section-shipping-zone-details" class="shadow-md scroll-mt-4">
			<template #header>
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-6 h-6" />
							<h2 class="text-xl font-semibold">{{ $t('components.shippingZoneForm.detailsTitle') }}</h2>
						</div>
						<p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
							{{ $t('components.shippingZoneForm.detailsSubtitle') }}
						</p>
					</div>
				</div>
			</template>

			<div class="space-y-6 py-2 px-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<UFormField name="name" :label="$t('common.name')" class="sm:col-span-2">
						<UInput v-model="state.name" />
					</UFormField>

					<UFormField name="is_active" :label="$t('common.status')">
						<USwitch v-model="state.is_active" :label="$t(state.is_active ? 'common.active' : 'common.inactive')" />
					</UFormField>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<UFormField name="country_code" :label="$t('pages.shippingZoneCountry')">
						<UInput v-model="state.country_code" maxlength="2" class="uppercase" />
					</UFormField>
					<UFormField name="state" :label="$t('pages.shippingZoneState')">
						<UInput v-model="state.state" />
					</UFormField>
				</div>

				<UFormField name="postcodes_text" :label="$t('pages.shippingZonePostcodes')">
					<UTextarea v-model="state.postcodes_text" :rows="3" autoresize />
				</UFormField>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<UFormField name="fee_override" :label="$t('pages.shippingZoneFeeOverride')">
						<UInput v-model.number="state.fee_override" type="number" min="0" step="0.01" />
					</UFormField>
					<UFormField name="estimated_days_override" :label="$t('pages.shippingZoneDaysOverride')">
						<UInput v-model.number="state.estimated_days_override" type="number" min="0" step="1" />
					</UFormField>
				</div>

				<UFormField name="shipping_method_ids" :label="$t('components.shippingZoneForm.supportedMethods')">
					<USelectMenu
						v-model="state.shipping_method_ids"
						:items="methodOptions"
						multiple
						value-key="value"
						label-key="label"
						:placeholder="$t('components.shippingZoneForm.selectMethods')"
						class="w-full"
					/>
				</UFormField>
			</div>
		</UCard>
	</div>
</template>

<script lang="ts" setup>
import { ICONS } from '~/utils/icons';

export type ShippingZoneFormState = {
	name: string;
	is_active: boolean;
	country_code: string;
	state: string;
	postcodes_text: string;
	fee_override?: number;
	estimated_days_override?: number;
	shipping_method_ids: string[];
};

defineProps<{
	state: ShippingZoneFormState;
	methodOptions: { label: string; value: string }[];
}>();
</script>
