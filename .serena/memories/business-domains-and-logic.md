# Business Domains and Logic – Wemotoo CRM Portal

## Domain Areas

- **Auth:** Login, logout, verify, password reset (forgot, validate token, confirm). Cookies: access-token, x-merchant-id. Public routes: login, forgot-password, reset-password.
- **Merchant info:** Store profile and settings; update via MerchantInfo routes.
- **Products:** CRUD, restore, soft delete; variants; listing. Related: brands, categories, tags, types, options (product options). Repository: ProductModule, ProductBrandModule, ProductCategoryModule, ProductTagModule, ProductTypeModule, ProductOptionModule, ProductVariantModule.
- **Orders:** List, detail by order_no; update customer, items, payments, status. Summaries and analytics (summ-orders: dashboard, customers, items, orders, export). Repository: OrderModule, SummOrderModule.
- **Sales:** Sales list and detail (bill_no); process, export. Summaries (summ-sales: dashboard, customers, items, payments, sales, export). Repository: SaleModule, SaleSummaryModule.
- **Customers:** List and single (cust_no). Repository: CustomerModule.
- **Outlets:** CRUD, restore. Repository: OutletModule.
- **Taxes:** Tax codes, groups, rules – CRUD and restore. Repository: TaxModule, TaxGroupModule, TaxRuleModule.
- **Payment:** Payment methods and payment type groups; configuration pages. Repository: PaymentMethodModule, PaymentTypeGroupModule.
- **CRM users:** CRUD; password change. Repository: CrmUserModule.
- **Appointments:** Create, update, delete, restore; calendar. Repository: AppointmentModule.
- **Settings:** Configuration, store profile. Repository: SettingModule, MerchantInfoModule.
- **Analytics:** Orders (summary, customers, items) and Sales (summary, customers, detail-listing, items, payments) under pages/analytics/.

## Data Flow

- UI (pages/components) → composables or direct `$api.{module}` → Nuxt server routes (`/api/...`) → backend (ecommerce-nestjs). Server routes add headers via generateHeaders (api key, merchant id, bearer token).
- List endpoints typically use OData-style query (BaseODataReq/BaseODataResp). Table columns and filter schemas live in app/utils/table-columns/ and app/utils/schema/.
- Forms use Zod schemas from app/utils/schema/{Entity}/ and VeeValidate; submit via repository create/update methods.

## Key Files for Understanding Flows

- `app/plugins/01.api.ts` – exposes all repository modules as `$api`.
- `app/repository/routes.client.ts` – client path builders (prefix + API_PATH from wemotoo-common).
- `server/routes.server.ts` – server-side Routes used in Nitro handlers; same API_PATH.
- `server/base_api.ts` – generateHeaders, generateImageHeaders (for uploads).
- `app/middleware/auth.global.ts` – redirect to login when no access token.
