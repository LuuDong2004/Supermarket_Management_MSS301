# POS And Loyalty Flow Design

## Goal

Implement the Sales/POS and Customer/Loyalty flows from `MSS301_SE1913_JV_Group4_RequirementSpec.docx` so the frontend can run an end-to-end demo now while keeping a clean boundary for future backend integration.

## Source Requirements

The implementation covers these SRS areas:

- `3.7 Customer & Loyalty Management`: search members by phone, add member, edit member, view points balance, view points transaction history, auto-generate member IDs, enforce unique phone numbers.
- `3.8 Promotion & Marketing Management`: expose active promotion and voucher rules for POS checkout, apply at most one promotion or voucher per transaction, validate minimum purchase and active status.
- `3.9 Sales & POS Operations`: scan/search products, add/update/remove cart items, validate stock, apply promotion, look up member, redeem points, select payment method, validate cash received, complete checkout, reduce stock, award loyalty points, generate invoice, and print receipt.

## Architecture

Use a frontend service boundary with mock-backed state first:

- `src/services/posService.js` owns sale calculations, cart operations, promotion/voucher validation, payment validation, invoice generation, stock updates, and checkout transaction creation.
- `src/services/loyaltyService.js` owns member lookup, registration, editing, point balance, point history, redeem validation, redeem posting, and award posting.
- `src/services/smsStore.js` owns mutable in-memory data initialized from `src/mock/db.js`, so POS, Members, and Loyalty screens share the same products, stock, customers, histories, and sales.
- Existing pages call services instead of duplicating business rules in local component code.

This keeps the UI usable without backend services. Later, the service modules can switch from the mock store to `src/lib/api.js` calls while preserving page-level APIs.

## Data Flow

`ProcessSale` becomes the primary checkout screen. The cashier can search by barcode or product name, add active products with stock, adjust quantities, search a loyalty member, apply one eligible promotion or voucher, redeem points in 100-point blocks, choose a payment method, and complete the transaction.

On checkout, `posService.checkoutSale` validates stock, payment, promotion, and point redemption. It then creates an invoice number using `INV-YYYYMMDD-XXXX`, reduces product stock, records the sale, awards points at `1 point / 10,000 VND after discount`, deducts redeemed points, records loyalty history, and returns a receipt model for the modal.

`Members` uses `loyaltyService` for search, add, edit, detail, and point history. New members receive IDs using `MEM-YYYYMMDD-XXXX`; duplicate phone numbers are rejected with the existing member ID in the message.

`Loyalty` uses the same service and shared store as POS. Manual redemption follows the same rule as checkout redemption: points can be redeemed only in blocks of 100, and `100 points = 10,000 VND`.

`Payment` remains available as a payment-focused support screen, but the end-to-end SRS checkout flow is completed in `ProcessSale` so a sale is not split across unrelated local page state.

## Business Rules

- Only products with `stock > 0` can be added to cart.
- Cart quantity cannot exceed current stock.
- One promotion or voucher can be applied per transaction.
- Percentage discounts are capped by the existing promotion data and cannot produce negative totals.
- Cash payments require amount received greater than or equal to grand total.
- Card, e-wallet, and QR payments show a pending gateway step and then record an approved mock payment.
- VAT remains 8 percent until the settings screen exposes a shared configurable value.
- Redeemed loyalty points must be positive, available in the member balance, and a multiple of 100.
- Loyalty points earned are calculated after discounts and before VAT.
- Completed checkout reduces stock immediately and records an immutable sale row for recent sales/history views.

## Error Handling

The UI shows toast errors for product not found, insufficient stock, duplicate member phone, invalid voucher/promotion, invalid point redemption, missing payment data, and cash amount below grand total.

The checkout service returns structured errors with stable codes so UI messages can remain user-friendly and future backend errors can be mapped consistently.

## Testing

Add focused tests around pure service behavior before changing page wiring:

- POS calculation: subtotal, discount, VAT, grand total, cash change.
- Cart and stock validation: cannot add out-of-stock products or exceed stock.
- Promotion/voucher: one discount only, invalid/minimum purchase errors.
- Loyalty: member phone uniqueness, generated member ID format, redeem block validation, award calculation.
- Checkout integration: successful checkout reduces stock, records sale, creates invoice, awards and deducts points.

Use Vitest and React Testing Library only if needed for page-level behavior. Service tests should cover most business rules without requiring a browser.

## Parallel Work Plan

The implementation can be split safely into independent tracks:

- Track A: shared mock store and POS service tests/implementation.
- Track B: loyalty service tests/implementation.
- Track C: wire `ProcessSale` to the services and receipt modal.
- Track D: wire `Members` and `Loyalty` to the shared loyalty service.
- Track E: run integration build and resolve cross-track issues.

Tracks A and B can be developed in parallel because their public APIs meet at a small shared store boundary. Tracks C and D can follow once those APIs are stable.

## Out Of Scope

- Real payment gateway integration.
- Real backend endpoint discovery or backend implementation.
- Offline sync persistence.
- Return/refund flow.
- Role changes beyond the existing route guards.
