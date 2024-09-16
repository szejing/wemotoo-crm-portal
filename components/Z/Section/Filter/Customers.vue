<template>
	<UCard>
		<div class="grid grid-cols-4 gap-4">
			<InputTextField label="Email Address" type="email" name="email" value="email" />
			<InputTextField label="Name" type="text" name="name" value="name" />
			<InputTextField label="Phone" type="text" name="phone" value="phone" />
			<!-- <InputTextField label="Postal Code" type="number" name="postal" value="postal" /> -->
			<InputTextField label="Country" type="text" name="country" value="country" />
			<InputSelectMenu label="Status" />
		</div>
	</UCard>
</template>

<script lang="ts" setup></script>

<style></style>
