<template>
	<UCard>
		<template #header>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<USkeleton class="h-5 w-5 rounded shrink-0" />
					<USkeleton class="h-6 w-48" />
				</div>
				<div class="flex items-center gap-2">
					<USkeleton class="h-9 w-20 rounded" />
					<USkeleton class="h-9 w-20 rounded" />
				</div>
			</div>
		</template>
		<div class="space-y-4">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="space-y-2">
					<USkeleton class="h-4 w-28" />
					<USkeleton class="h-10 w-full" />
				</div>
				<div class="space-y-2">
					<USkeleton class="h-4 w-24" />
					<USkeleton class="h-10 w-full" />
				</div>
				<div class="space-y-2 sm:col-span-2">
					<USkeleton class="h-4 w-20" />
					<USkeleton class="h-10 w-full" />
				</div>
				<div class="space-y-2">
					<USkeleton class="h-4 w-24" />
					<USkeleton class="h-10 w-full" />
				</div>
				<div class="space-y-2">
					<USkeleton class="h-4 w-24" />
					<div class="flex items-center gap-2 pt-2">
						<USkeleton class="h-5 w-5 rounded" />
						<USkeleton class="h-4 w-32" />
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup></script>
