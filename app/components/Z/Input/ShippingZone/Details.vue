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
					<UFormField name="code" :label="$t('common.code')">
						<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.shippingZoneForm.fieldHints.code') }}</p>
						<UInput v-model="state.code" class="font-mono" maxlength="32" />
					</UFormField>

					<UFormField name="is_active" :label="$t('common.status')">
						<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.shippingZoneForm.fieldHints.status') }}</p>
						<USwitch v-model="state.is_active" :label="$t(state.is_active ? 'common.active' : 'common.inactive')" />
					</UFormField>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<UFormField name="description" :label="$t('common.description')">
						<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.shippingZoneForm.fieldHints.description') }}</p>
						<UInput v-model="state.description" />
					</UFormField>

					<UFormField name="rule" :label="$t('pages.shippingZoneRule')">
						<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.shippingZoneForm.fieldHints.rule') }}</p>
						<UInput v-model.number="state.rule" type="number" min="0" step="1" />
					</UFormField>
				</div>

				<div v-if="SHIPPING_ZONE_SHOW_COUNTRY_AND_POSTCODE_FIELDS" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<UFormField name="country_code" :label="$t('pages.shippingZoneCountry')">
						<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.shippingZoneForm.fieldHints.country') }}</p>
						<UInput v-model="state.country_code" maxlength="2" class="uppercase" />
					</UFormField>
					<UFormField name="state" :label="$t('pages.shippingZoneState')">
						<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.shippingZoneForm.fieldHints.state') }}</p>
						<UInput v-model="stateTextSingleMode" />
					</UFormField>
				</div>

				<UFormField v-else name="state" :label="$t('pages.shippingZoneState')">
					<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.shippingZoneForm.fieldHints.state') }}</p>
					<USelectMenu
						v-model="state.state"
						:items="stateOptions"
						multiple
						value-key="value"
						label-key="label"
						size="md"
						class="w-full"
						:placeholder="$t('components.shippingZoneForm.selectStates')"
					>
						<template #default>
							<div v-if="state.state.length > 0" class="flex flex-wrap gap-1.5">
								<UBadge v-for="st in state.state" :key="st" color="primary" variant="subtle" class="inline-flex max-w-[min(100%,12rem)] items-center gap-1">
									<span class="min-w-0 truncate">{{ stateLabel(st) }}</span>
									<UIcon
										:name="ICONS.CROSS"
										class="w-3.5 h-3.5 shrink-0 text-error-500 dark:text-error-400 hover:text-error-600 dark:hover:text-error-300 cursor-pointer"
										@click.stop="removeState(st)"
									/>
								</UBadge>
							</div>
							<span v-else class="text-neutral-400 text-sm">{{ $t('components.shippingZoneForm.selectStates') }}</span>
						</template>
						<template #item="{ item }">
							<UBadge color="primary" variant="subtle" class="truncate">
								{{ item.label }}
							</UBadge>
						</template>
					</USelectMenu>
				</UFormField>

				<UFormField
					v-if="SHIPPING_ZONE_SHOW_COUNTRY_AND_POSTCODE_FIELDS"
					name="postcodes_text"
					:label="$t('pages.shippingZonePostcodes')"
				>
					<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.shippingZoneForm.fieldHints.postcodes') }}</p>
					<UTextarea v-model="state.postcodes_text" :rows="3" autoresize />
				</UFormField>

				<UFormField name="shipping_method_ids" :label="$t('components.shippingZoneForm.supportedMethods')">
					<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.shippingZoneForm.fieldHints.supportedMethods') }}</p>
					<USelectMenu
						v-model="state.shipping_method_ids"
						:items="methodOptions"
						multiple
						value-key="value"
						label-key="label"
						size="md"
						:placeholder="$t('components.shippingZoneForm.selectMethods')"
						class="w-full"
					>
						<template #default>
							<div v-if="state.shipping_method_ids.length > 0" class="flex flex-wrap gap-1.5">
								<UBadge
									v-for="id in state.shipping_method_ids"
									:key="id"
									color="primary"
									variant="subtle"
									class="inline-flex max-w-[min(100%,12rem)] items-center gap-1"
								>
									<span class="min-w-0 truncate">{{ methodLabel(id) }}</span>
									<UIcon
										:name="ICONS.CROSS"
										class="w-3.5 h-3.5 shrink-0 text-error-500 dark:text-error-400 hover:text-error-600 dark:hover:text-error-300 cursor-pointer"
										@click.stop="removeMethod(id)"
									/>
								</UBadge>
							</div>
							<span v-else class="text-neutral-400 text-sm">{{ $t('components.shippingZoneForm.selectMethods') }}</span>
						</template>

						<template #item="{ item }">
							<UBadge color="primary" variant="subtle" class="truncate">
								{{ item.label }}
							</UBadge>
						</template>
					</USelectMenu>
				</UFormField>

				<div v-if="state.shipping_method_ids.length > 0" class="space-y-4">
					<p class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
						{{ $t('components.shippingZoneForm.perMethodPricingTitle') }}
					</p>
					<div
						v-for="mid in state.shipping_method_ids"
						:key="mid"
						class="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-default/40 p-4 bg-elevated/30"
					>
						<p class="sm:col-span-2 text-sm font-medium text-primary-600 dark:text-primary-400">
							{{ methodLabel(mid) }}
						</p>
						<UFormField :name="`method_pricing.${mid}.fee`" :label="$t('pages.shippingZoneFeeOverride')">
							<UInput v-model.number="state.method_pricing[mid]!.fee" type="number" min="0" step="0.01" />
						</UFormField>
						<UFormField :name="`method_pricing.${mid}.estimated_days`" :label="$t('pages.shippingZoneDaysOverride')">
							<UInput v-model.number="state.method_pricing[mid]!.estimated_days" type="number" min="0" step="1" />
						</UFormField>
					</div>
				</div>
			</div>
		</UCard>
	</div>
</template>

<script lang="ts" setup>
import { SHIPPING_ZONE_SHOW_COUNTRY_AND_POSTCODE_FIELDS, mergeMalaysiaStateOptions } from '~/utils/data/malaysia-states';
import { ICONS } from '~/utils/icons';

export type ShippingZoneFormState = {
	code: string;
	description: string;
	rule: number;
	is_active: boolean;
	country_code: string;
	/** Malaysia mode: multiple ISO-style names; full mode: zero or one entry synced from text input. */
	state: string[];
	postcodes_text: string;
	shipping_method_ids: string[];
	method_pricing: Record<string, { fee: number; estimated_days?: number }>;
};

const props = defineProps<{
	state: ShippingZoneFormState;
	methodOptions: { label: string; value: string }[];
}>();

function methodLabel(value: string): string {
	return props.methodOptions.find((o) => o.value === value)?.label ?? value;
}

function removeMethod(id: string) {
	props.state.shipping_method_ids = props.state.shipping_method_ids.filter((x) => x !== id);
	delete props.state.method_pricing[id];
}

watch(
	() => props.state.shipping_method_ids.slice(),
	(ids) => {
		const mp = props.state.method_pricing;
		for (const id of ids) {
			if (mp[id] === undefined) {
				mp[id] = { fee: 0, estimated_days: undefined };
			}
		}
		for (const key of Object.keys(mp)) {
			if (!ids.includes(key)) {
				delete mp[key];
			}
		}
	},
	{ deep: true },
);

function removeState(value: string) {
	props.state.state = props.state.state.filter((x) => x !== value);
}

const stateOptions = computed(() => mergeMalaysiaStateOptions(props.state.state));

function stateLabel(value: string): string {
	return stateOptions.value.find((o) => o.value === value)?.label ?? value;
}

/** When country/postcode fields are shown, `state` is a single free-text value in one slot. */
const stateTextSingleMode = computed({
	get() {
		return props.state.state[0] ?? '';
	},
	set(v: string) {
		const trimmed = v.trim();
		props.state.state = trimmed ? [trimmed] : [];
	},
});
</script>
