# Changelog

All notable changes to the Wemotoo CRM Portal are documented here.

---

## [Unreleased]

### New Features

- **Multi-language support (i18n)** — The portal now supports multiple languages. UI strings, validation messages, and options can be displayed in English and Bahasa Melayu. Empty states and period selectors are translated for a consistent experience.
- **Back button** — A dedicated Back button component improves navigation so you can return to previous pages more easily.
- **Loading skeletons** — Product updates and the default layout now show loading skeletons instead of blank space while data is loading, so the interface feels more responsive.
- **Calendar and appointments** — New calendar components for appointment management. You can view and manage appointments with improved time slot logic and filters.
- **Merchant Info module** — New module to view and update merchant information, with a clearer settings and navigation structure.
- **Password recovery** — Forgot password flow: request a reset link, validate it, and set a new password. Password management is improved in Change Password and Reset Password screens.
- **CRM user management** — Manage CRM users: view, edit, and change passwords. User management is integrated into the portal.
- **Soft delete and restore** — Many merchant entities (e.g. outlets, product categories, tax rules) now support soft delete and restore, so you can recover accidentally removed items.
- **Appointment date and time** — Appointments use explicit start and end date-times, with clearer formatting of date ranges.
- **Order export** — Export order data for reporting and external use. Export functionality is also available for sales and related summaries.
- **Product placeholder** — Product table uses a dedicated product holder image when no product image is available.

### Improvements

- **Dashboard** — Dashboard statistics and order chart are enhanced for better visibility of key metrics.
- **Navigation** — Navigation is more responsive and consistent, with improved key handling and animations. Sidebar, user menu, and date range components are more responsive.
- **Product management** — Product updates support partial updates; product listing and detail pages have better loading states and navigation. Product creation and update forms have clearer layout and guidance.
- **Login and auth** — Login form fields and authentication flow are updated for clarity and accessibility. Phone input uses a dedicated ZPhoneInput component.
- **Appointment management** — Appointment filters and UI are revamped; time slot logic is modularized for easier maintenance.
- **Currency and formatting** — Currency formatting is centralized and applied consistently across order columns, analytics, and filters. Order and sale components use standardized transaction data handling.
- **Filters and search** — New or improved filters for Payment Methods, Payment Type Groups, Tax Codes, and Outlets. Filter layouts and select menus are more consistent and easier to use.
- **Pagination** — Pagination components use v-model for clearer data binding and behavior.
- **Docker and build** — Dockerfile and dependency management are refactored for more reliable builds.
- **Coding rules** — Project conventions and coding rules are documented for the Wemotoo CRM Portal.

### Bug Fixes

- **Product management loading** — Loading component and label in product management are corrected so loading state is shown properly.
- **Repository imports** — Repository modules import path is fixed so the application resolves modules correctly.

### Technical / Internal

- Validation schema functions updated for consistency. API route definitions no longer use the merchant prefix where it added noise. Various refactors for product update handling, navigation rendering (hydration), and form handling. Documentation and lockfile updates.

---

*Changelog generated from git history. Format inspired by [Keep a Changelog](https://keepachangelog.com/).*
