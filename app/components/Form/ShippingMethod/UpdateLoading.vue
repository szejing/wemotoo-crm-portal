<template>
	<div class="w-full animate-in fade-in duration-200">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
			<div class="lg:col-span-9 space-y-6">
				<div class="rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-md overflow-hidden">
					<div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
						<div class="flex items-center gap-2">
							<USkeleton class="h-6 w-6 rounded shrink-0" />
							<USkeleton class="h-6 w-48" />
						</div>
						<USkeleton class="h-4 w-72 max-w-full mt-2" />
					</div>
					<div class="p-4 sm:p-6 space-y-6">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="space-y-2 sm:col-span-2">
								<USkeleton class="h-4 w-16" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-24" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-28" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-28" />
								<USkeleton class="h-10 w-full" />
							</div>
							<div class="space-y-2">
								<USkeleton class="h-4 w-20" />
								<USkeleton class="h-6 w-32 rounded-full" />
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-md overflow-hidden">
					<div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
						<div class="flex items-center gap-2">
							<USkeleton class="h-6 w-6 rounded shrink-0" />
							<USkeleton class="h-6 w-52" />
						</div>
						<USkeleton class="h-4 w-full max-w-md mt-2" />
					</div>
					<div class="p-4 sm:p-6 space-y-4">
						<USkeleton class="h-6 w-40 rounded-full" />
					</div>
				</div>
			</div>

			<div class="lg:col-span-3">
				<div class="lg:sticky lg:top-4">
					<div class="rounded-lg border border-primary-200/60 dark:border-primary-900/40 shadow-lg overflow-hidden">
						<div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
							<USkeleton class="h-10 w-10 rounded-full" />
							<USkeleton class="h-5 w-40" />
							<USkeleton class="h-4 w-56" />
						</div>
						<div class="p-4 sm:p-6 space-y-4">
							<USkeleton class="h-24 w-full rounded-xl" />
							<USkeleton class="h-20 w-full rounded-xl" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup></script>
