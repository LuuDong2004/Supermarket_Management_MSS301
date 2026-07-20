# Black-and-white UI mockup mode

The mockup is rendered by the existing React screens, so its layout, responsive
behaviour, states, controls, and content hierarchy are identical to the web UI.
Only colour is converted to a high-contrast grey scale.

## Open a screen

Run the frontend and append `?mockup=bw` to any URL. For example:

```text
http://localhost:4173/login?mockup=bw
http://localhost:4173/app/dashboard?mockup=bw
http://localhost:4173/app/pos/sale?mockup=bw
http://localhost:4173/app/warehouse/purchase-orders?mockup=bw
http://localhost:4173/app/hr/employees?mockup=bw
http://localhost:4173/app/admin/users?mockup=bw
http://localhost:4173/app/ceo/reports?mockup=bw
```

Role-restricted screens can also be opened for capture without signing in. Add
the relevant role to the same query string, for example:

```text
http://localhost:4173/app/pos/sale?mockup=bw&role=ROLE_CASHIER
http://localhost:4173/app/warehouse/purchase-orders?mockup=bw&role=ROLE_WAREHOUSE_MANAGER
http://localhost:4173/app/hr/employees?mockup=bw&role=ROLE_STAFF_MANAGER
http://localhost:4173/app/admin/users?mockup=bw&role=ROLE_ADMIN
http://localhost:4173/app/ceo/reports?mockup=bw&role=ROLE_CEO
```

The role parameter is only accepted while `mockup=bw` is present; it does not
change real authentication or authorisation.

The mode applies to every route in `Supermarket_UI/src/App.jsx`, including the
login, profile, dashboard, POS, warehouse, HR, administration, CEO, reports,
settings, and 403/404 screens. It also applies to drawers, dialogs, tables,
charts, and print layouts.

## Screen captures

Run the following from the workspace root to recreate the 58 desktop PNG
captures (1440 × 1100):

```powershell
.\docs\mockups\capture-mockups.ps1
```

The generated files are saved under `docs/mockups/screens/` and are numbered by
workflow and screen name.

## Export

Use the browser print dialog while in mockup mode and select **Save as PDF** to
export any screen at its current viewport size. The normal UI remains unchanged
when `mockup=bw` is omitted.
