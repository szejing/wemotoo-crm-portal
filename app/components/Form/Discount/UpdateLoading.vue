<template>
	<div class="w-full animate-in fade-in duration-200 space-y-6">
		<div class="rounded-lg border border-neutral-200 shadow-md overflow-hidden">
			<div class="p-4 sm:p-6 border-b border-neutral-200">
				<USkeleton class="h-6 w-48" />
			</div>
			<div class="p-4 sm:p-6 space-y-4">
				<div class="space-y-2">
					<USkeleton class="h-4 w-20" />
					<USkeleton class="h-10 w-full max-w-xs" />
				</div>
				<div class="space-y-2">
					<USkeleton class="h-4 w-28" />
					<USkeleton class="h-24 w-full" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup></script>
