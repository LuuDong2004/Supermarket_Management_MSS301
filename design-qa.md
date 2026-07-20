# UIChange visual QA

## Source visual truth

- `E:\Ky8\MSS301\docx\UIChange\sections_3_3_to_3_11_bw_realistic\`
- SRS: `E:\Ky8\MSS301\docx\UIChange\SRS_SRD_GROUP4_MSS301_SE1913\MSS301_SE1913_JV_Group4_SRS_MAIN.docx`

## Implementation target

- Local app: `Supermarket_UI`
- Implementation screenshot path: unavailable (browser bootstrap failed)
- Intended viewport: desktop 1440 × 900/1100
- Intended states: populated demo data, role-specific navigation, black/white reference UI

## Changes applied

- Shared shell now uses the mockup frame: full-width top bar, 250px navigation rail,
  bordered navigation items, compact content spacing, square controls, and black/white tokens.
- Role navigation is reduced to the compact menu shown by each supplied screen set.
- Screen titles use the document's English names and every documented route receives its
  matching `3.x.x screen mock-up` footer marker.
- Purchase orders, management reports, POS sale, and system settings now use the same
  left-table/right-detail composition shown in the reference images.
- All documented mockup routes are now rendered through `Supermarket_UI/src/pages/ReferenceScreen.jsx`
  with screen-specific layouts for reports, split table/detail forms, POS payment, loyalty,
  promotions, settings, and audit traceability.
- Cards, filters, forms, tables, buttons, tabs, and charts now use the reference border,
  spacing, typography, and grayscale treatment.
- `VITE_USE_MOCK=true` now actually supplies populated demo fixtures to all screens when
  the gateway is offline, matching the data density shown in the supplied mockups.

## Verification

- `npm run build` — passed.
- `git diff --check` — passed.
- HTTP dev server response — 200.
- Browser-rendered screenshot comparison — blocked: the in-app browser runtime fails during
  initialization with `Cannot redefine property: process`, so a fresh implementation capture
  and console/interaction inspection could not be completed in this environment.

## Comparison evidence

- Full-view comparison: unavailable because the revised implementation could not be captured.
- Focused-region comparison: unavailable for the same reason.

## Final result: blocked

The source mockups and code changes are present, but the required same-viewport visual QA
cannot be honestly marked passed until a browser-rendered capture is available.
