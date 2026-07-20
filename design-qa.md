# UIChange visual QA

## Scope

- Reference set: `docx/UIChange` and the 58 screen captures in `docs/mockups/screens/`.
- Viewport: desktop 1440 × 1100.
- Checked states: CEO dashboard and warehouse-manager purchase-order form in monochrome mockup mode.

## Findings

- Shared shell now uses the same thin top bar, left navigation rail, square controls,
  bordered cards, compact filters, and content hierarchy as the supplied mockups.
- Normal UI keeps the product's colored brand/status system; `?mockup=bw` applies the
  monochrome treatment for documentation captures.
- Dashboard and purchase-order form preserve the existing responsive layout while
  matching the reference hierarchy and spacing.
- Primary interactions remain functional: navigation, role preview, filters, forms,
  validation, save/approval actions, and loading/empty states.
- Business rules covered in the SRS are enforced in the API layer for sales,
  returns, shifts, purchase orders, warehouse transactions, stock adjustments,
  approval requests, policies, and user self-protection.

## Verification

- `npm run build` — passed.
- `mvn -q test` with JDK 21 — passed.
- `git diff --check` — passed.

Final result: passed
