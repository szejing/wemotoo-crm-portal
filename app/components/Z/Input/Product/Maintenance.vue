<template>
	<div class="space-y-2">
		<!-- ************* MOBILE ************* -->
		<div class="sm:hidden flex flex-col justify-start items-start py-6 gap-8">
			<UCheckbox
				v-model="prodMetadata.requires_booking"
				name="requires_booking"
				:label="$t('components.zInput.requiresBooking')"
				color="success"
				@update:model-value="updateRequiresBooking"
			/>

			<div class="flex flex-col sm:flex-row sm:justify-between w-full">
				<div>
					<h3>{{ $t('components.zInput.duration') }}</h3>
					<p class="text-sm text-neutral-500">{{ $t('components.zInput.durationDesc') }}</p>
				</div>
				<div class="w-full max-w-[250px]">
					<ZSelectMenuDuration :duration="prodMetadata.duration" @update:duration="updateDuration" />
				</div>
			</div>

			<div class="flex flex-col sm:flex-row sm:justify-between w-full">
				<div>
					<h3>{{ $t('components.zInput.offDay') }}</h3>
					<p class="text-sm text-neutral-500">{{ $t('components.zInput.offDayDesc') }}</p>
					<p class="text-sm text-neutral-500">{{ $t('components.zInput.offDayNote') }}</p>
				</div>
				<div class="w-full max-w-[250px]">
					<ZSelectMenuDays :days="prodMetadata.off_day" @update:days="updateOffDay" />
				</div>
			</div>

			<div class="flex-col-start w-full md:w-full">
				<h3>{{ $t('components.zInput.operatingHours') }}</h3>
				<p class="text-sm text-neutral-500">{{ $t('components.zInput.operatingHoursDesc') }}</p>
				<div class="w-full flex flex-col md:flex-row md:justify-between md:items-center">
					<div class="w-full max-w-[250px]">
						<ZSelectMenuTime title="08.00 am" :time="prodMetadata.start_time" type="start" @update:time="updateStartTime" />
					</div>

					<div class="w-full max-w-[250px]">
						<ZSelectMenuTime title="05.00 pm" :time="prodMetadata.end_time" type="end" @update:time="updateEndTime" />
					</div>
				</div>
			</div>
		</div>
		<!-- ************* MOBILE ************* -->

		<!-- ************* DESKTOP ************* -->
		<div class="hidden sm:flex flex-col justify-start items-start py-6 gap-8">
			<UCheckbox
				v-model="prodMetadata.requires_booking"
				name="requires_booking"
				:label="$t('components.zInput.requiresBooking')"
				color="success"
				@update:model-value="updateRequiresBooking"
			/>

			<div class="flex flex-col sm:flex-row sm:justify-between w-full">
				<div>
					<h3>{{ $t('components.zInput.duration') }}</h3>
					<p class="text-sm text-neutral-500">{{ $t('components.zInput.durationDesc') }}</p>
				</div>
				<div class="w-full max-w-[250px]">
					<ZSelectMenuDuration :duration="prodMetadata.duration" @update:duration="updateDuration" />
				</div>
			</div>

			<div class="flex flex-col sm:flex-row sm:justify-between w-full">
				<div>
					<h3>{{ $t('components.zInput.offDay') }}</h3>
					<p class="text-sm text-neutral-500">{{ $t('components.zInput.offDayDesc') }}</p>
					<p class="text-sm text-neutral-500">{{ $t('components.zInput.offDayNote') }}</p>
				</div>
				<div class="w-full max-w-[250px]">
					<ZSelectMenuDays :days="prodMetadata.off_day" @update:days="updateOffDay" />
				</div>
			</div>

			<div class="flex-col-start w-full md:w-full">
				<h3>{{ $t('components.zInput.operatingHours') }}</h3>
				<p class="text-sm text-neutral-500">{{ $t('components.zInput.operatingHoursDesc') }}</p>
				<div class="w-full flex flex-col md:flex-row md:justify-between md:items-center">
					<div class="w-full max-w-[250px]">
						<ZSelectMenuTime title="08.00 am" :time="prodMetadata.start_time" type="start" @update:time="updateStartTime" />
					</div>

					<div class="w-[50px] text-center">
						<span class="text-neutral-400 hidden sm:block"> > </span>
					</div>

					<div class="w-full max-w-[250px]">
						<ZSelectMenuTime title="05.00 pm" :time="prodMetadata.end_time" type="end" @update:time="updateEndTime" />
					</div>
				</div>
			</div>
		</div>
		<!-- ************* DESKTOP ************* -->
	</div>
</template>

<script lang="ts" setup>
import type { MaintenanceMetadata } from 'wemotoo-common';

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
			return props.metadata as MaintenanceMetadata;
		} else {
			return {
				requires_booking: false,
				duration: '',
				start_time: '',
				end_time: '',
				off_day: [],
			} as MaintenanceMetadata;
		}
	},
	set(value) {
		emit('update:productMetadata', value);
	},
});

const updateRequiresBooking = (value: boolean) => {
	prodMetadata.value.requires_booking = value;
	prodMetadata.value = JSON.parse(JSON.stringify(prodMetadata.value));
};

const updateDuration = (value: string) => {
	prodMetadata.value.duration = value;
	prodMetadata.value = JSON.parse(JSON.stringify(prodMetadata.value));
};

const updateOffDay = (value: string[]) => {
	prodMetadata.value.off_day = value;
	prodMetadata.value = JSON.parse(JSON.stringify(prodMetadata.value));
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

<style scoped></style>
