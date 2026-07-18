# SMS — Supermarket Management System (Frontend)

Giao diện web **React 18 + Vite + Tailwind CSS** cho hệ thống quản lý siêu thị
MSS301. Phong cách SaaS dashboard hiện đại, sạch, phân quyền theo vai trò, phủ
toàn bộ 30 màn hình nghiệp vụ trong tài liệu đặc tả (mục 3.3 → 3.11).

## 1. Chạy nhanh

```bash
cd Supermarket_UI
npm install
npm run dev          # http://localhost:5173
```

Dev server proxy `/api` → gateway (`http://localhost:8080`). Đổi target bằng biến
môi trường `VITE_API_TARGET` nếu cần.

### Đăng nhập

- **Backend thật đang chạy:** dùng tài khoản seed (`ceo` / `admin`, mật khẩu
  `password`). App gọi `POST /api/auth/login` rồi `GET /api/users/me`.
- **Backend chưa chạy:** bật `VITE_USE_MOCK=true` (mặc định). Khi gateway không
  phản hồi, app tự chuyển **chế độ demo** với các tài khoản:
  `ceo · admin · cashier · warehouse · staffmanager` (mật khẩu `123456`). Có nút
  đăng nhập nhanh ở màn hình Login.

## 2. Phân quyền & điều hướng

Sidebar tự lọc theo vai trò người dùng (`src/routes/nav.js`). Mỗi route được bảo
vệ bằng `ProtectedRoute` (`ROUTE_ROLES`).

| Vai trò | Khu vực truy cập |
|---------|------------------|
| `ROLE_CASHIER` | POS (3.8), Thành viên/Khuyến mãi (3.9) |
| `ROLE_WAREHOUSE_MANAGER` | Kho — Quản lý (3.6): đơn mua, duyệt giao dịch, giám sát, báo cáo kho, nhà cung cấp (3.6.5) + Báo cáo tồn kho (3.10.2) |
| `ROLE_WAREHOUSE_STAFF` | Kho — Vận hành (3.7): nhận hàng, tồn kho, kiểm kê, điều chỉnh, trạng thái duyệt, in tem (3.7.6) |
| `ROLE_STAFF_MANAGER` | Nhân sự (3.5): hồ sơ, chấm công, đánh giá hiệu suất + Báo cáo hiệu suất (3.10.3) |
| `ROLE_ADMIN` | Quản trị hệ thống (3.4) + Hệ thống (3.11) — không tham gia bán hàng/kho/nhân sự |
| `ROLE_CEO` | Điều hành (3.3), xem Báo cáo hiệu suất nhân viên (3.10.3, chỉ xem) |

## 3. Bản đồ màn hình → tài liệu

| Mục | Màn hình | File |
|-----|----------|------|
| 3.3.1 | Báo cáo quản trị | `pages/ceo/Reports.jsx` |
| 3.3.2 | Phê duyệt (CEO) | `pages/ceo/Approvals.jsx` |
| 3.3.3 | Chính sách kinh doanh | `pages/ceo/Policies.jsx` |
| 3.4.1 | Tài khoản người dùng | `pages/admin/Users.jsx` *(nối backend thật)* |
| 3.4.2 | Yêu cầu phê duyệt | `pages/admin/ApprovalRequests.jsx` |
| 3.4.3 | Giám sát hệ thống | `pages/admin/Monitoring.jsx` |
| 3.5.1 | Hồ sơ nhân viên | `pages/hr/Employees.jsx` |
| 3.5.2 | Chấm công | `pages/hr/Attendance.jsx` |
| 3.5.3 | Đánh giá hiệu suất | `pages/hr/Performance.jsx` |
| 3.6.1 | Đơn mua hàng | `pages/warehouse/PurchaseOrders.jsx` |
| 3.6.2 | Duyệt giao dịch kho | `pages/warehouse/Transactions.jsx` |
| 3.6.3 | Giám sát tồn kho | `pages/warehouse/Monitor.jsx` |
| 3.6.4 | Báo cáo kho | `pages/warehouse/Reports.jsx` |
| 3.6.5 | Nhà cung cấp | `pages/warehouse/Suppliers.jsx` |
| 3.7.1 | Nhận hàng | `pages/warehouse/Receive.jsx` |
| 3.7.2 | Thông tin tồn kho | `pages/warehouse/Inventory.jsx` |
| 3.7.3 | Kiểm kê | `pages/warehouse/StockCount.jsx` |
| 3.7.4 | Điều chỉnh tồn kho | `pages/warehouse/Adjustments.jsx` |
| 3.7.5 | Trạng thái duyệt | `pages/warehouse/ApprovalStatus.jsx` |
| 3.7.6 | In tem nhãn | `pages/warehouse/Labels.jsx` |
| 3.8.1 | Bán hàng | `pages/pos/ProcessSale.jsx` |
| 3.8.2 | Xử lý thanh toán | `pages/pos/Payment.jsx` |
| 3.8.3 | Ca thu ngân | `pages/pos/Shift.jsx` |
| 3.9.1 | Khách hàng thành viên | `pages/pos/Members.jsx` |
| 3.9.2 | Điểm thưởng | `pages/pos/Loyalty.jsx` |
| 3.9.3 | Khuyến mãi & Voucher | `pages/pos/Promotions.jsx` |
| 3.10.2 | Kho & Tồn kho | `pages/reports/InventoryReport.jsx` |
| 3.10.3 | Hiệu suất nhân viên | `pages/reports/EmployeeReport.jsx` |
| 3.11.1 | Cấu hình hệ thống | `pages/settings/SystemSettings.jsx` |
| 3.11.2 | Quy tắc & Nhật ký kiểm toán | `pages/settings/BusinessRules.jsx` |

## 4. Kiến trúc thư mục

```
src/
├── lib/            api.js (fetch + JWT), format.js, cn.js
├── context/        AuthContext.jsx (login thật + fallback demo)
├── mock/           db.js (dữ liệu mẫu), mockApi.js (tài khoản demo)
├── components/
│   ├── ui/         Button, Card, Badge, DataTable, StatCard, Modal, Tabs,
│   │               Charts (recharts), Toast, PageHeader/FilterBar, primitives
│   └── layout/     AppShell, Sidebar, Topbar
├── routes/         nav.js (menu theo role), ProtectedRoute.jsx
├── pages/          33 trang (xem bảng trên)
└── App.jsx         router + guard
```

## 5. Tích hợp backend thật (khi service nghiệp vụ hoàn thành)

Hiện chỉ `auth-service` + `user-service` có thật → màn hình **Tài khoản người
dùng** đã gọi `GET /api/users`. Các module còn lại dùng `src/mock/db.js`. Để nối
backend mới: thay lời gọi `db.*` trong trang tương ứng bằng `api.get/post(...)`
tới endpoint của service (sales, inventory, product, reporting...), rồi đặt
`VITE_USE_MOCK=false`. Lớp `api.js` đã tự gắn `Bearer` token và bóc tách
`ApiResponse<T>`.

## 6. Build

```bash
npm run build        # → dist/  (đã verify: 2425 modules, 0 lỗi)
npm run preview
```

> MSS301 · SE1913 · JV Group 4
