# Type Refactoring Summary

## Overview

All types have been refactored to separate **Input types** (for create/update operations) from **Model types** (for display/read operations).

## Pattern

Each entity now follows this pattern:

```typescript
// Input type - for create/update operations
export type EntityInput = {
	// Uses primitives, IDs, codes for relations
	// Optional fields marked with ?
};

// Reference type - for selections/dropdowns
export type EntityRef = {
	// Minimal fields for display in selects
};

// Model type - for display/read operations
export type Entity = {
	// Has populated relations (full objects)
	// Has timestamps (created_at, updated_at)
	// All required fields from backend
};
```

## Refactored Types

### Core Product Types

#### ✅ Product (`utils/types/product.ts`)

- `ProductInput` - for creating/updating products
- `ProductRef` - for product selection
- `Product` - for displaying products
- **Deprecated aliases** for backward compatibility:
  - `ProdOptionInput` → `ProductOptionInput`
  - `ProdVariantInput` → `ProductVariantInput`
  - `ProdOptionValuesInput` → `ProductOptionValueInput`

#### ✅ Price (`utils/types/price.ts`)

- `PriceInput` - for price input
- `Price` - for displaying prices with timestamps

#### ✅ ProductType (`utils/types/product-type.ts`)

- `ProductTypeInput` - for creating/updating product types
- `ProductTypeRef` - for selection
- `ProductType` - for display

#### ✅ ProductOption (`utils/types/product-option.ts`)

- `ProductOptionInput` - for creating/updating options
- `ProductOption` - for display with full details

#### ✅ ProductOptionValue (`utils/types/product-option-value.ts`)

- `ProductOptionValueInput` - for input
- `ProductOptionValue` - for display

#### ✅ ProductVariant (`utils/types/product-variant.ts`)

- `ProductVariantInput` - for creating/updating variants
- `ProductVariant` - for display

### Tax Types

#### ✅ Tax (`utils/types/tax.ts`)

- Already had: `TaxInput`, `Tax` ✓

#### ✅ TaxGroup (`utils/types/tax-group.ts`)

- `TaxGroupInput` - for creating/updating tax groups
- `TaxGroupRef` - for selection
- `TaxGroup` - for display

#### ✅ TaxRule (`utils/types/tax-rule.ts`)

- Already had: `TaxRuleInput`, `TaxRule` ✓

### Business Entity Types

#### ✅ Outlet (`utils/types/outlet.ts`)

- `OutletInput` - for creating/updating outlets
- `OutletRef` - for selection
- `Outlet` - for display

#### ✅ Customer (`utils/types/customer.ts`)

- `CustomerInput` - for creating/updating customers
- `CustomerRef` - for selection
- `Customer` - for display

### Payment Types

#### ✅ PaymentMethod (`utils/types/payment-method.ts`)

- `PaymentMethodInput` - for creating/updating payment methods
- `PaymentMethodRef` - for selection
- `PaymentMethod` - for display

#### ✅ PaymentType (`utils/types/payment-type.ts`)

- `PaymentTypeInput` - for creating/updating payment types
- `PaymentTypeRef` - for selection
- `PaymentType` - for display
- `PaymentTypeGroupInput` - for payment type groups
- `PaymentTypeGroup` - for display

### Other Types

#### ✅ Brand (`utils/types/brand.ts`)

- Already had: `BrandInput`, `Brand` ✓

#### ✅ Tag (`utils/types/tag.ts`)

- Already had: `TagInput`, `Tag` ✓

#### ✅ Category (`utils/types/category.ts`)

- Already had: `CategoryInput`, `Category` ✓

#### ✅ Appointment (`utils/types/appointment.ts`)

- Already had: `AppointmentInput`, `Appointment` ✓

## Updated Repository Request Types

All repository request types have been updated to use the new Input types:

- ✅ `repository/modules/product/models/request/create-product.req.ts`
- ✅ `repository/modules/outlets/models/request/create-outlet.req.ts`
- ✅ `repository/modules/tax-groups/models/request/create-tax-group.req.ts`
- ✅ `repository/modules/product-option/models/request/create-product-option.req.ts`

## Updated Form Types

All form creation types have been cleaned up:

- ✅ `utils/types/form/product-creation.ts` - Uses `ProductInput` pattern
- ✅ `utils/types/form/product-option-creation.ts`
- ✅ `utils/types/form/outlet-creation.ts`
- ✅ `utils/types/form/tax/tax-creation.ts`
- ✅ `utils/types/form/tax/tax-group-creation.ts`
- ✅ `utils/types/form/tax/tax-rule-creation.ts`
- ✅ `utils/types/form/category-creation.ts`
- ✅ `utils/types/form/brand-creation.ts`
- ✅ `utils/types/form/tag-creation.ts`
- ✅ `utils/types/form/product-type-creation.ts`

All removed unnecessary `| undefined` in favor of optional `?` syntax.

## Migration Guide

### For Create/Update Operations

**Before:**

```typescript
import type { Product } from '~/utils/types/product';

const product: Product = {
	code: undefined,
	name: undefined,
	brands: [{ code: 'nike' }],
	categories: [{ code: 'shoes' }],
	// ...
};
```

**After:**

```typescript
import type { ProductInput } from '~/utils/types/product';

const product: ProductInput = {
	name: 'New Product',
	brand_codes: ['nike'],
	category_codes: ['shoes'],
	tag_ids: [1, 2, 3],
	type_id: 5,
	// ...
};
```

### For Display/Listing

**Before:**

```typescript
import type { Product } from '~/utils/types/product';

const products: Product[] = await fetchProducts();
// Product has mixed concerns
```

**After:**

```typescript
import type { Product } from '~/utils/types/product';

const products: Product[] = await fetchProducts();
// Product is now clearly a model type with full relations
// Access populated: products[0].brands, products[0].categories
```

### For Selections/Dropdowns

**New:**

```typescript
import type { ProductRef } from '~/utils/types/product';

const productOptions: ProductRef[] = await fetchProductOptions();
// Only has code and name for efficient selects
```

## Benefits

1. **Type Safety** ✅
   - Create operations can't accidentally use model fields
   - Display operations have correct types for populated relations

2. **Clear Intent** ✅
   - Code is self-documenting
   - Function signatures clearly show purpose

3. **Better API Design** ✅
   - Input types match API expectations
   - Model types match API responses
   - Ref types for efficient queries

4. **Prevents Errors** ✅
   - Can't send `File` objects where URLs expected
   - Can't send full objects where IDs/codes expected

## Backward Compatibility

All deprecated type names have aliases in `product.ts`:

- `ProdOptionInput` → `ProductOptionInput`
- `ProdVariantInput` → `ProductVariantInput`
- `ProdOptionValuesInput` → `ProductOptionValueInput`

These will continue to work but should be migrated to new names.

## Next Steps

### Component Updates (Optional)

The following components use deprecated type names and can be gradually migrated:

1. Product Components:
   - `components/Form/Product/Update.vue`
   - `components/Form/Product/Creation.vue`
   - `components/Form/Product/StepperCreation.vue`
   - `components/Z/Modal/Product/Detail.vue`
   - `components/Z/Input/Product/Variant/index.vue`
   - `components/Z/Input/Product/Variant/Detail.vue`
   - `components/Z/Input/Product/Options.vue`
   - `components/Z/Input/Product/Variant/List.vue`
   - `components/Z/Input/Product/AdditionalInfo.vue`

2. Selection Components:
   - `components/Z/Selection/Options.vue`
   - `components/Input/OptionTags.vue`

3. Page Components:
   - `pages/products/listing/[code]/detail.vue`

**Migration is NOT urgent** - backward compatibility aliases ensure nothing breaks.

## Summary

✅ **Completed:**

- 11 entity types refactored with Input/Model/Ref separation
- All repository request types updated
- All form types cleaned up
- Backward compatibility maintained

🎯 **Result:**

- Clear separation of concerns
- Type-safe create/update/display operations
- Better developer experience
- Foundation for scalable type system
