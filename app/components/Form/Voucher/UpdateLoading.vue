<template>
	<div class="w-full animate-in fade-in duration-200">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
			<div class="lg:col-span-9 space-y-6">
				<!-- Voucher details -->
				<div class="rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-md overflow-hidden">
					<div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
						<div class="flex items-center gap-2">
							<USkeleton class="h-6 w-6 rounded shrink-0" />
							<USkeleton class="h-6 w-48" />
						</div>
						<USkeleton class="h-4 w-72 max-w-full mt-2" />
					</div>
					<div class="p-4 sm:p-6 space-y-6">
						<div class="flex justify-end">
							<USkeleton class="h-6 w-40 rounded-full" />
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="space-y-2">
								<USkeleton class="h-4 w-16" />
								<USkeleton class="h-3 w-full max-w-xs" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-24" />
								<USkeleton class="h-3 w-full max-w-xs" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-28" />
								<USkeleton class="h-3 w-full max-w-xs" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-32" />
								<USkeleton class="h-3 w-full max-w-xs" />
								<USkeleton class="h-10 w-full" />
							</div>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="space-y-2">
								<USkeleton class="h-4 w-28" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-24" />
								<USkeleton class="h-10 w-full" />
							</div>
						</div>
					</div>
				</div>
				<!-- Discount rule -->
				<div class="rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-md overflow-hidden">
					<div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
						<div class="flex items-center gap-2">
							<USkeleton class="h-6 w-6 rounded shrink-0" />
							<USkeleton class="h-6 w-40" />
						</div>
					</div>
					<div class="p-4 sm:p-6 space-y-4">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="space-y-2">
								<USkeleton class="h-4 w-28" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-32" />
								<USkeleton class="h-10 w-full" />
							</div>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="space-y-2">
								<USkeleton class="h-4 w-24" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-28" />
								<USkeleton class="h-10 w-full" />
							</div>
						</div>
					</div>
				</div>
				<!-- Discount conditions -->
				<div class="rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-md overflow-hidden">
					<div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
						<div class="flex flex-wrap items-center justify-between gap-3">
							<div class="flex items-center gap-2">
								<USkeleton class="h-6 w-6 rounded shrink-0" />
								<USkeleton class="h-6 w-36" />
							</div>
							<USkeleton class="h-8 w-28 rounded-md" />
						</div>
						<USkeleton class="h-4 w-full max-w-lg mt-2" />
					</div>
					<div class="p-4 sm:p-6 space-y-4">
						<USkeleton class="h-4 w-full max-w-md" />
						<USkeleton class="h-32 w-full rounded-lg" />
					</div>
				</div>
			</div>
			<div class="lg:col-span-3">
				<div class="lg:sticky lg:top-4">
					<div class="rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden">
						<div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
							<USkeleton class="h-10 w-10 rounded-full" />
							<USkeleton class="h-5 w-40" />
							<USkeleton class="h-4 w-56" />
						</div>
						<div class="p-4 sm:p-6 space-y-4">
							<USkeleton class="h-24 w-full rounded-xl" />
							<USkeleton class="h-20 w-full rounded-xl" />
							<USkeleton class="h-28 w-full rounded-xl" />
							<USkeleton class="h-24 w-full rounded-xl" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup></script>
