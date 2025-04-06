<template>
	<div v-for="(navigate, index) in navigations" :key="index" class="flex flex-col">
		<!-- when have child navigaiton -->
		<div v-if="navigate.children && navigate.children.length > 0">
			<ZNavigationCollapsible
				:id="index"
				:navigate="navigate"
				:collapsed="navigate.isCollapsed"
				:item="{
					title:
						'px-4 py-3 mx-2 rounded-md text-base font-light cursor-pointer text-secondary-100 bg-transparent hover:bg-main-50 hover:text-secondary-700 hover:font-semibold transition duration-500 ease-in-out',
					icon: '',
				}"
				@toggle="toggleCollapse"
			>
				<template #content>
					<div v-for="(child, childIndex) in navigate.children" :key="childIndex" class="flex flex-col">
						<NuxtLink :to="child.to" class="active-link" exact-active-class="exact-active-link">
							{{ child.title }}
						</NuxtLink>
					</div>
				</template>
			</ZNavigationCollapsible>
		</div>

		<!-- when do not have child navigaiton -->
		<NuxtLink v-else :to="navigate.to" class="active-link" exact-active-class="exact-active-link">
			<div class="flex items-center gap-4">
				<UIcon v-if="navigate.icon" :name="navigate.icon" class="w-5 h-5" />
				{{ navigate.title }}
			</div>
		</NuxtLink>
	</div>
</template>

<script lang="ts" setup>
const appUiStore = useAppUiStore();

const { navigations } = storeToRefs(appUiStore);

const toggleCollapse = (id: number) => {
	navigations.value.forEach((el, index) => {
		if (id === index) {
			el.isCollapsed = !el.isCollapsed;
		}
	});
};
</script>

<style scoped lang="postcss">
/**************************** sidebar styling ****************************/

.active-link {
	@apply px-4 py-3 mx-2 rounded-md text-base font-light cursor-pointer text-secondary-100 bg-transparent
	hover:bg-main-50 hover:text-secondary-700 hover:font-semibold transition duration-500 ease-in-out;
}
.exact-active-link {
	@apply bg-main-50 text-secondary-700 font-semibold;
}
</style>
