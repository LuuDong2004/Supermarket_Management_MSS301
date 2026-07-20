param(
  [int]$Start = 1,
  [int]$End = 58
)

$ErrorActionPreference = 'Stop'
$workspace = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$screenDir = Join-Path $PSScriptRoot 'screens'
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$baseUrl = 'http://127.0.0.1:4173'

if (!(Test-Path -LiteralPath $chrome)) {
  throw "Chrome was not found at $chrome"
}
New-Item -ItemType Directory -Force -Path $screenDir | Out-Null

$screens = @(
  @{ n = '01'; file = 'login'; path = '/login'; role = $null },
  @{ n = '02'; file = 'dashboard'; path = '/app/dashboard'; role = 'ROLE_CEO' },
  @{ n = '03'; file = 'profile'; path = '/app/profile'; role = 'ROLE_ADMIN' },

  @{ n = '04'; file = 'pos-sale'; path = '/app/pos/sale'; role = 'ROLE_CASHIER' },
  @{ n = '05'; file = 'pos-returns'; path = '/app/pos/returns'; role = 'ROLE_CASHIER' },
  @{ n = '06'; file = 'pos-return-form'; path = '/app/pos/returns/new'; role = 'ROLE_CASHIER' },
  @{ n = '07'; file = 'pos-shift'; path = '/app/pos/shift'; role = 'ROLE_CASHIER' },
  @{ n = '08'; file = 'pos-members'; path = '/app/pos/members'; role = 'ROLE_CASHIER' },
  @{ n = '09'; file = 'pos-loyalty'; path = '/app/pos/loyalty'; role = 'ROLE_CASHIER' },
  @{ n = '10'; file = 'pos-promotions'; path = '/app/pos/promotions'; role = 'ROLE_CASHIER' },

  @{ n = '11'; file = 'warehouse-purchase-orders'; path = '/app/warehouse/purchase-orders'; role = 'ROLE_WAREHOUSE_MANAGER' },
  @{ n = '12'; file = 'warehouse-purchase-order-form'; path = '/app/warehouse/purchase-orders/new'; role = 'ROLE_WAREHOUSE_MANAGER' },
  @{ n = '13'; file = 'warehouse-transactions'; path = '/app/warehouse/transactions'; role = 'ROLE_WAREHOUSE_MANAGER' },
  @{ n = '14'; file = 'warehouse-monitor'; path = '/app/warehouse/monitor'; role = 'ROLE_WAREHOUSE_MANAGER' },
  @{ n = '15'; file = 'warehouse-reports'; path = '/app/warehouse/reports'; role = 'ROLE_WAREHOUSE_MANAGER' },
  @{ n = '16'; file = 'warehouse-products'; path = '/app/warehouse/products'; role = 'ROLE_WAREHOUSE_MANAGER' },
  @{ n = '17'; file = 'warehouse-product-form'; path = '/app/warehouse/products/new'; role = 'ROLE_WAREHOUSE_MANAGER' },
  @{ n = '18'; file = 'warehouse-suppliers'; path = '/app/warehouse/suppliers'; role = 'ROLE_WAREHOUSE_MANAGER' },
  @{ n = '19'; file = 'warehouse-receive'; path = '/app/warehouse/receive'; role = 'ROLE_WAREHOUSE_STAFF' },
  @{ n = '20'; file = 'warehouse-inventory'; path = '/app/warehouse/inventory'; role = 'ROLE_WAREHOUSE_STAFF' },
  @{ n = '21'; file = 'warehouse-stock-count'; path = '/app/warehouse/stock-count'; role = 'ROLE_WAREHOUSE_STAFF' },
  @{ n = '22'; file = 'warehouse-stock-count-form'; path = '/app/warehouse/stock-count/new'; role = 'ROLE_WAREHOUSE_STAFF' },
  @{ n = '23'; file = 'warehouse-adjustments'; path = '/app/warehouse/adjustments'; role = 'ROLE_WAREHOUSE_STAFF' },
  @{ n = '24'; file = 'warehouse-adjustment-form'; path = '/app/warehouse/adjustments/new'; role = 'ROLE_WAREHOUSE_STAFF' },
  @{ n = '25'; file = 'warehouse-approval-status'; path = '/app/warehouse/approval-status'; role = 'ROLE_WAREHOUSE_STAFF' },
  @{ n = '26'; file = 'warehouse-goods-receipts'; path = '/app/warehouse/goods-receipts'; role = 'ROLE_WAREHOUSE_STAFF' },
  @{ n = '27'; file = 'warehouse-goods-receipt-form'; path = '/app/warehouse/goods-receipts/new'; role = 'ROLE_WAREHOUSE_STAFF' },
  @{ n = '28'; file = 'warehouse-barcode'; path = '/app/warehouse/barcode'; role = 'ROLE_WAREHOUSE_STAFF' },

  @{ n = '29'; file = 'hr-employees'; path = '/app/hr/employees'; role = 'ROLE_STAFF_MANAGER' },
  @{ n = '30'; file = 'hr-employee-form'; path = '/app/hr/employees/new'; role = 'ROLE_STAFF_MANAGER' },
  @{ n = '31'; file = 'hr-shifts'; path = '/app/hr/shifts'; role = 'ROLE_STAFF_MANAGER' },
  @{ n = '32'; file = 'hr-shift-form'; path = '/app/hr/shifts/new'; role = 'ROLE_STAFF_MANAGER' },
  @{ n = '33'; file = 'hr-attendance'; path = '/app/hr/attendance'; role = 'ROLE_STAFF_MANAGER' },
  @{ n = '34'; file = 'hr-attendance-form'; path = '/app/hr/attendance/new'; role = 'ROLE_STAFF_MANAGER' },
  @{ n = '35'; file = 'hr-timesheet'; path = '/app/hr/timesheet'; role = 'ROLE_STAFF_MANAGER' },
  @{ n = '36'; file = 'hr-performance'; path = '/app/hr/performance'; role = 'ROLE_STAFF_MANAGER' },

  @{ n = '37'; file = 'admin-users'; path = '/app/admin/users'; role = 'ROLE_ADMIN' },
  @{ n = '38'; file = 'admin-user-form'; path = '/app/admin/users/new'; role = 'ROLE_ADMIN' },
  @{ n = '39'; file = 'admin-approval-requests'; path = '/app/admin/approval-requests'; role = 'ROLE_ADMIN' },
  @{ n = '40'; file = 'admin-monitoring'; path = '/app/admin/monitoring'; role = 'ROLE_ADMIN' },
  @{ n = '41'; file = 'admin-permissions'; path = '/app/admin/permissions'; role = 'ROLE_ADMIN' },
  @{ n = '42'; file = 'admin-security-alerts'; path = '/app/admin/security-alerts'; role = 'ROLE_ADMIN' },
  @{ n = '43'; file = 'admin-notifications'; path = '/app/admin/notifications'; role = 'ROLE_ADMIN' },

  @{ n = '44'; file = 'ceo-reports'; path = '/app/ceo/reports'; role = 'ROLE_CEO' },
  @{ n = '45'; file = 'ceo-approvals'; path = '/app/ceo/approvals'; role = 'ROLE_CEO' },
  @{ n = '46'; file = 'ceo-policies'; path = '/app/ceo/policies'; role = 'ROLE_CEO' },
  @{ n = '47'; file = 'ceo-promotions'; path = '/app/ceo/promotions'; role = 'ROLE_CEO' },
  @{ n = '48'; file = 'ceo-financial'; path = '/app/ceo/financial'; role = 'ROLE_CEO' },
  @{ n = '49'; file = 'ceo-operational'; path = '/app/ceo/operational'; role = 'ROLE_CEO' },
  @{ n = '50'; file = 'ceo-decisions'; path = '/app/ceo/decisions'; role = 'ROLE_CEO' },
  @{ n = '51'; file = 'ceo-decision-form'; path = '/app/ceo/decisions/new'; role = 'ROLE_CEO' },

  @{ n = '52'; file = 'report-inventory'; path = '/app/reports/inventory'; role = 'ROLE_WAREHOUSE_MANAGER' },
  @{ n = '53'; file = 'report-employees'; path = '/app/reports/employees'; role = 'ROLE_STAFF_MANAGER' },
  @{ n = '54'; file = 'settings-system'; path = '/app/settings/system'; role = 'ROLE_ADMIN' },
  @{ n = '55'; file = 'settings-business-rules'; path = '/app/settings/rules'; role = 'ROLE_ADMIN' },
  @{ n = '56'; file = 'settings-business-rule-form'; path = '/app/settings/rules/new'; role = 'ROLE_ADMIN' },
  @{ n = '57'; file = 'forbidden'; path = '/app/forbidden'; role = 'ROLE_ADMIN' },
  @{ n = '58'; file = 'not-found'; path = '/not-found'; role = $null }
)

$screens | Select-Object -Skip ($Start - 1) | Select-Object -First ($End - $Start + 1) | ForEach-Object {
  $query = '?mockup=bw'
  if ($_.role) { $query += "&role=$($_.role)" }
  $url = "$baseUrl$($_.path)$query"
  $out = Join-Path $screenDir "$($_.n)-$($_.file).png"
  if (Test-Path -LiteralPath $out) { Remove-Item -LiteralPath $out -Force }

  $arguments = @(
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1440,1100',
    '--virtual-time-budget=1500', "--screenshot=$out", $url
  )
  Start-Process -FilePath $chrome -ArgumentList $arguments -Wait -WindowStyle Hidden

  $deadline = (Get-Date).AddSeconds(12)
  while (!(Test-Path -LiteralPath $out) -and (Get-Date) -lt $deadline) {
    Start-Sleep -Milliseconds 250
  }
  if (!(Test-Path -LiteralPath $out)) { throw "Screenshot was not created: $out" }
  Write-Output "Captured $($_.n): $($_.file)"
}
