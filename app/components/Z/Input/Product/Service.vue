<template>
	<div class="space-y-6">
		<!-- Requires booking -->
		<div class="flex items-start gap-3">
			<UCheckbox
				v-model="prodMetadata.requires_booking"
				name="requires_booking"
				:label="$t('components.zInput.requiresBooking')"
				color="success"
				@update:model-value="updateRequiresBooking"
			/>
		</div>

		<!-- Duration -->
		<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
			<div class="min-w-0">
				<label class="text-sm font-medium text-default">{{ $t('components.zInput.duration') }}</label>
				<p class="text-sm text-muted">{{ $t('components.zInput.durationDesc') }}</p>
			</div>
			<div class="w-full sm:w-40 shrink-0">
				<ZSelectMenuDuration :duration="prodMetadata.duration" @update:duration="updateDuration" />
			</div>
		</div>

		<!-- Off days -->
		<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
			<div class="min-w-0">
				<label class="text-sm font-medium text-default">{{ $t('components.zInput.offDay') }}</label>
				<p class="text-sm text-muted">{{ $t('components.zInput.offDayDesc') }}</p>
				<p class="text-xs text-muted mt-0.5">{{ $t('components.zInput.offDayNote') }}</p>
			</div>
			<div class="w-full sm:w-48 shrink-0">
				<ZSelectMenuDays :days="offDayArray" @update:days="updateOffDay" />
			</div>
		</div>

		<!-- Operating hours -->
		<div class="flex flex-col gap-2">
			<label class="text-sm font-medium text-default">{{ $t('components.zInput.operatingHours') }}</label>
			<p class="text-sm text-muted">{{ $t('components.zInput.operatingHoursDesc') }}</p>
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
				<div class="w-full sm:w-40 shrink-0">
					<ZSelectMenuTime
						:title="$t('components.zInput.selectTime')"
						:time="prodMetadata.start_time"
						type="start"
						@update:time="updateStartTime"
					/>
				</div>
				<span class="hidden sm:inline text-muted shrink-0" aria-hidden="true">–</span>
				<div class="w-full sm:w-40 shrink-0">
					<ZSelectMenuTime
						:title="$t('components.zInput.selectTime')"
						:time="prodMetadata.end_time"
						type="end"
						@update:time="updateEndTime"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { ServiceMetadata } from 'wemotoo-common';

const props = defineProps({
	metadata: {
		type: Object as PropType<Record<string, unknown> | undefined>,
		required: false,
	},
});

const emit = defineEmits(['update:productMetadata']);

const prodMetadata = computed({
	get() {
		if (props.metadata) {
			return props.metadata as ServiceMetadata;
		}
		return {
			requires_booking: false,
			duration: '',
			start_time: '',
			end_time: '',
			off_day: null,
		} as ServiceMetadata;
	},
	set(value) {
		emit('update:productMetadata', value);
	},
});

/** Normalize off_day (string | null from API) to string[] for ZSelectMenuDays. */
const offDayArray = computed({
	get(): string[] | null {
		const raw = prodMetadata.value.off_day;
		if (raw == null || raw === '') return null;
		if (Array.isArray(raw)) return raw as string[];
		return raw.split(',').map((s) => s.trim()).filter(Boolean);
	},
	set(value: string[] | null) {
		const next = value?.length ? value.join(',') : null;
		(prodMetadata.value as { off_day: string | null }).off_day = next;
		prodMetadata.value = JSON.parse(JSON.stringify(prodMetadata.value));
	},
});

const updateRequiresBooking = (value: boolean | 'indeterminate') => {
	prodMetadata.value.requires_booking = value === true;
	prodMetadata.value = JSON.parse(JSON.stringify(prodMetadata.value));
};

const updateDuration = (value: string) => {
	prodMetadata.value.duration = value;
	prodMetadata.value = JSON.parse(JSON.stringify(prodMetadata.value));
};

const updateOffDay = (value: string[]) => {
	offDayArray.value = value.length ? value : null;
};

const updateStartTime = (value: string) => {
	prodMetadata.value.start_time = value;
	prodMetadata.value = JSON.parse(JSON.stringify(prodMetadata.value));
};

const updateEndTime = (value: string) => {
	prodMetadata.value.end_time = value;
	prodMetadata.value = JSON.parse(JSON.stringify(prodMetadata.value));
};
</script>
