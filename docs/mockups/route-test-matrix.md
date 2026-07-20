# UIChange 3.3–3.11 — route test matrix

Chạy frontend ở `http://localhost:5173`, sau đó mở URL tương ứng. Khi chưa muốn đăng nhập backend, thêm `?mockup=bw&role=ROLE_*` vào URL để bật user preview theo role.

Ví dụ: `http://localhost:5173/app/pos/sale?mockup=bw&role=ROLE_CASHIER`

| Màn hình trong `sections_3_3_to_3_11_bw_realistic` | Route | Role test |
|---|---|---|
| 3.3.1 `View_Management_Reports` | `/app/ceo/reports` | `ROLE_CEO` |
| 3.3.2 `Process_Approval_Request` | `/app/ceo/approvals` | `ROLE_CEO` |
| 3.3.3 `Manage_Business_Policy` | `/app/ceo/policies` | `ROLE_CEO` |
| 3.4.1 `Manage_User_Accounts` | `/app/admin/users` | `ROLE_ADMIN` |
| 3.4.2 `Submit_and_View_Approval_Request` | `/app/admin/approval-requests` | `ROLE_ADMIN` |
| 3.4.3 `Monitor_System_Logs_and_Status` | `/app/admin/monitoring` | `ROLE_ADMIN` |
| 3.5.1 `Manage_Employee_Profile_and_Work_History` | `/app/hr/employees` | `ROLE_STAFF_MANAGER` |
| 3.5.2 `Manage_Attendance_Records_and_Reports` | `/app/hr/attendance` | `ROLE_STAFF_MANAGER` |
| 3.5.3 `Evaluate_Performance_and_Recommend_Reward_or_Salary` | `/app/hr/performance` | `ROLE_STAFF_MANAGER` |
| 3.6.1 `Manage_Purchase_Order` | `/app/warehouse/purchase-orders` | `ROLE_WAREHOUSE_MANAGER` |
| 3.6.2 `Approve_Warehouse_Transaction` | `/app/warehouse/transactions` | `ROLE_WAREHOUSE_MANAGER` |
| 3.6.3 `Monitor_Inventory_Low_Stock_and_Expiring_Products` | `/app/warehouse/monitor` | `ROLE_WAREHOUSE_MANAGER` |
| 3.6.4 `View_Warehouse_Reports` | `/app/warehouse/reports` | `ROLE_WAREHOUSE_MANAGER` |
| 3.7.1 `Receive_Goods` | `/app/warehouse/receive` | `ROLE_WAREHOUSE_STAFF` |
| 3.7.2 `View_Inventory_Information` | `/app/warehouse/inventory` | `ROLE_WAREHOUSE_STAFF` |
| 3.7.3 `Conduct_Stock_Count` | `/app/warehouse/stock-count` | `ROLE_WAREHOUSE_STAFF` |
| 3.7.4 `Submit_Stock_Adjustment_Request` | `/app/warehouse/adjustments` | `ROLE_WAREHOUSE_STAFF` |
| 3.7.5 `View_Approval_Status` | `/app/warehouse/approval-status` | `ROLE_WAREHOUSE_STAFF` |
| 3.8.1 `Process_Sale` | `/app/pos/sale` | `ROLE_CASHIER` |
| 3.8.2 `Process_Payment` | `/app/pos/payment` | `ROLE_CASHIER` |
| 3.8.3 `Manage_Cashier_Shift` | `/app/pos/shift` | `ROLE_CASHIER` |
| 3.9.1 `Search_or_Register_Customer_Member` | `/app/pos/members` | `ROLE_CASHIER` |
| 3.9.2 `View_and_Redeem_Loyalty_Points` | `/app/pos/loyalty` | `ROLE_CASHIER` |
| 3.9.3 `Apply_Promotion_Discount_or_Voucher` | `/app/pos/promotions` | `ROLE_CASHIER` |
| 3.10.1 `Generate_Sales_and_Business_Performance_Reports` | `/app/reports/sales` | `ROLE_CEO`, `ROLE_WAREHOUSE_MANAGER`, `ROLE_STAFF_MANAGER` |
| 3.10.2 `Generate_Inventory_and_Warehouse_Reports` | `/app/reports/inventory` | `ROLE_CEO`, `ROLE_WAREHOUSE_MANAGER` |
| 3.10.3 `Generate_Employee_Performance_Reports` | `/app/reports/employees` | `ROLE_CEO`, `ROLE_STAFF_MANAGER` |
| 3.11.1 `Configure_System_Settings` | `/app/settings/system` | `ROLE_ADMIN` |
| 3.11.2 `Maintain_Business_Rules_and_Audit_Traceability` | `/app/settings/rules` | `ROLE_ADMIN` |

## Query mẫu theo role

- CEO: `?mockup=bw&role=ROLE_CEO`
- Admin: `?mockup=bw&role=ROLE_ADMIN`
- Cashier: `?mockup=bw&role=ROLE_CASHIER`
- Warehouse manager: `?mockup=bw&role=ROLE_WAREHOUSE_MANAGER`
- Warehouse staff: `?mockup=bw&role=ROLE_WAREHOUSE_STAFF`
- Staff manager: `?mockup=bw&role=ROLE_STAFF_MANAGER`

Các route thao tác chi tiết vẫn giữ nguyên để test nghiệp vụ: `/new`, `/:id`, `/:id/edit` dưới từng nhóm resource (đơn mua hàng, phiếu nhập, kiểm kê, điều chỉnh, nhân viên, chấm công, user và business rule).
