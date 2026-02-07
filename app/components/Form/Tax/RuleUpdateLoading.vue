<template>
	<div class="space-y-4">
		<!-- General Info (code + description) -->
		<div class="space-y-4">
			<div class="space-y-2">
				<USkeleton class="h-4 w-16" />
				<USkeleton class="h-10 w-full" />
			</div>
			<div class="space-y-2">
				<USkeleton class="h-4 w-24" />
				<USkeleton class="h-10 w-full" />
			</div>
		</div>

		<!-- Details section header -->
		<div class="flex items-center justify-between mt-6">
			<USkeleton class="h-4 w-32" />
			<USkeleton class="h-9 w-28 rounded" />
		</div>

		<!-- Detail rows (mirror list structure) -->
		<div class="space-y-3 mt-4">
			<div
				v-for="i in 2"
				:key="i"
				class="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
			>
				<div class="flex-1 min-w-0 space-y-2">
					<div class="flex items-center gap-2">
						<USkeleton class="h-4 w-24" />
						<USkeleton class="h-5 w-14 rounded" />
						<USkeleton class="h-5 w-12 rounded" />
					</div>
					<USkeleton class="h-3 w-48" />
					<div class="flex items-center gap-2">
						<USkeleton class="h-3 w-28" />
						<USkeleton class="h-3 w-24" />
					</div>
				</div>
				<USkeleton class="h-8 w-8 rounded shrink-0" />
			</div>
		</div>

		<!-- Submit button -->
		<div class="flex-center text-center mt-3">
			<USkeleton class="h-10 w-full max-w-xs rounded" />
		</div>
	</div>
</template>

<script lang="ts" setup></script>
