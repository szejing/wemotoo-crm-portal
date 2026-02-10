# Project Rules

## Styling Guidelines

### CSS Only - No Tailwind Syntax

When creating styles for components, **do not use Tailwind syntax**. All styling must be written in **CSS** (either in `<style>` blocks or separate CSS files).

**❌ Don't use:**

```vue
<div class="flex items-center justify-center p-4 bg-blue-500">
```

**✅ Do use:**

```vue
<template>
	<div class="container"></div>
</template>

<style scoped>
.container {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	background-color: #3b82f6;
}
</style>
```

## JavaScript/TypeScript Guidelines

### Use `const` for Function Declarations

Do not use the `function` keyword for function declarations. Always use `const` with arrow functions instead.

**❌ Don't use:**

```javascript
function myFunction() {
	// code
}
```

**✅ Do use:**

```javascript
const myFunction = () => {
	// code
};
```

This applies to:

- Standalone functions
- Methods defined outside of classes
- Utility functions
- Helper functions

**Note:** This rule does not apply to Vue component methods defined inside the `methods` or `setup` options, which follow Vue's conventions.
